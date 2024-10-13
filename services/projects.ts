import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';

import {db} from '@/lib/firebase';
import {ProjectWithoutId, type Project} from '@/types/project';

/**
 * Fetches all projects from the Firestore 'projects' collection.
 * @returns A Promise that resolves to an array of Project objects.
 */
export const getAllProjects = async (): Promise<Project[]> => {
  const projectsSnapshot = await getDocs(collection(db, 'projects'));

  if (projectsSnapshot.empty) {
    return [];
  }

  const projects: Project[] = [];
  projectsSnapshot.forEach(projectSnapshot => {
    const projectData = projectSnapshot.data() as Project;
    const project: Project = {
      ...projectData,
      id: projectSnapshot.id,
    };

    projects.push(project);
  });

  return projects;
};

/**
 * Fetches a specific project by its ID from the Firestore 'projects' collection.
 * @param id - The ID of the project to retrieve.
 * @returns A Promise that resolves to the specified Project object.
 */
export const getProjectById = async (id: string): Promise<Project> => {
  const projectSnapshot = await getDoc(doc(db, 'projects', id));

  if (!projectSnapshot.exists()) {
    throw new Error(`Project with ID ${id} does not exist.`);
  }

  const projectData = projectSnapshot.data() as Project;
  const project: Project = {
    ...projectData,
    id: projectSnapshot.id,
  };

  return project;
};

/**
 * Adds a new projects to the Firestore 'projectss' collection.
 * @param projects - The Project object to be added without the ID property.
 * @returns A Promise that resolves when the projects has been added.
 */
export const createProject = async (
  project: ProjectWithoutId
): Promise<void> => {
  await addDoc(collection(db, 'projects'), project);
};

/**
 * Updates an existing project in the Firestore 'projects' collection.
 * @param id - The ID of the project to update.
 * @param project - The updated project object.
 * @returns A Promise that resolves when the project has been updated.
 */
export const updateProject = async (
  id: string,
  project: Project
): Promise<void> => {
  await setDoc(doc(db, 'projects', id), project);
};

/**
 * Deletes an project from the Firestore 'projects' collection by its ID.
 * @param id - The ID of the project to delete.
 * @returns A Promise that resolves when the project has been deleted.
 */
export const deleteProject = async (id: string): Promise<void> => {
  await deleteDoc(doc(db, 'projects', id));
};
