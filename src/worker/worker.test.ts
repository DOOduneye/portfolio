import { createExecutionContext, env, waitOnExecutionContext } from "cloudflare:test"
import { beforeEach, describe, expect, it } from "vitest"
import worker from "./index"

async function call(request: Request, overrides: Partial<typeof env> = {}): Promise<Response> {
  const ctx = createExecutionContext()
  const response = await worker.fetch(request, { ...env, ...overrides }, ctx)
  await waitOnExecutionContext(ctx)
  return response
}

function createProject(name: string): Request {
  return new Request("https://davidoduneye.com/trpc/admin.projects.create?batch=1", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ 0: { name, description: "d" } })
  })
}

beforeEach(async () => {
  await env.DB.exec("DELETE FROM audit_log")
  await env.DB.exec("DELETE FROM projects")
})

describe("admin mutations", () => {
  it("writes the row and audits it under the caller's identity", async () => {
    const response = await call(createProject("integration-project"))
    expect(response.status).toBe(200)

    const body = (await response.json()) as [{ result: { data: unknown } }]
    expect(body[0]!.result.data).toMatchObject({ name: "integration-project" })

    const projects = await env.DB.prepare("SELECT name FROM projects").all<{ name: string }>()
    expect(projects.results.map(row => row.name)).toEqual(["integration-project"])

    const audit = await env.DB.prepare(
      "SELECT actor_email, action, resource_type, metadata_json FROM audit_log"
    ).all<{
      actor_email: string
      action: string
      resource_type: string
      metadata_json: string
    }>()
    expect(audit.results).toEqual([
      {
        actor_email: "dev@localhost",
        action: "admin.projects.create",
        resource_type: "projects",
        metadata_json: JSON.stringify({
          name: "integration-project",
          description: "d"
        })
      }
    ])
  })

  it("refuses and writes nothing when Access has not authenticated", async () => {
    const response = await call(createProject("should-not-exist"), {
      ENVIRONMENT: "production"
    })

    const body = (await response.json()) as [{ error: { data: { code: string } } }]
    expect(body[0]!.error.data.code).toBe("UNAUTHORIZED")

    const projects = await env.DB.prepare("SELECT count(*) AS n FROM projects").first<{
      n: number
    }>()
    expect(projects!.n).toBe(0)

    const audit = await env.DB.prepare("SELECT count(*) AS n FROM audit_log").first<{ n: number }>()
    expect(audit!.n).toBe(0)
  })
})

describe("public routes", () => {
  it("serves public data without an identity", async () => {
    const response = await call(
      new Request("https://davidoduneye.com/trpc/public.projects.visible"),
      { ENVIRONMENT: "production" }
    )
    expect(response.status).toBe(200)
    expect(await response.json()).toMatchObject({ result: { data: [] } })
  })

  it("redirects www to the apex instead of serving the admin API", async () => {
    const response = await call(
      new Request("https://www.davidoduneye.com/trpc/admin.projects.create", {
        method: "POST"
      }),
      { ENVIRONMENT: "production" }
    )
    expect(response.status).toBe(301)
    expect(response.headers.get("location")).toBe(
      "https://davidoduneye.com/trpc/admin.projects.create"
    )
  })
})
