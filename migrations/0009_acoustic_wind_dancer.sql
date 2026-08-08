ALTER TABLE `projects` ADD `stack` text DEFAULT '' NOT NULL;
--> statement-breakpoint
INSERT INTO `projects` (`name`, `url`, `description`, `stack`, `sort_order`, `visible`)
  SELECT 'Student Activity Calendar', NULL, 'A campus events platform serving 15,000+ students, with a Go backend, web and mobile apps, admin dashboards, and a development CLI.', 'Go · React · React Native · Redis · AWS · Postgres', 0, 1
  WHERE NOT EXISTS (SELECT 1 FROM `projects` WHERE `name` = 'Student Activity Calendar');
--> statement-breakpoint
INSERT INTO `projects` (`name`, `url`, `description`, `stack`, `sort_order`, `visible`)
  SELECT 'brain-kit', 'https://github.com/DOOduneye/brain-kit', 'A CLI, vault skeleton, and set of skills for developing out of a personal knowledge base with Claude Code.', 'TypeScript · Claude Code', 1, 1
  WHERE NOT EXISTS (SELECT 1 FROM `projects` WHERE `name` = 'brain-kit');
--> statement-breakpoint
INSERT INTO `projects` (`name`, `url`, `description`, `stack`, `sort_order`, `visible`)
  SELECT 'monkey', 'https://github.com/DOOduneye/monkey', 'An interpreter and compiler for the Monkey language, from Thorsten Ball''s books.', 'Go', 2, 1
  WHERE NOT EXISTS (SELECT 1 FROM `projects` WHERE `name` = 'monkey');
--> statement-breakpoint
INSERT INTO `projects` (`name`, `url`, `description`, `stack`, `sort_order`, `visible`)
  SELECT 'hydrate', 'https://github.com/DOOduneye/hydrate', 'A token-based authentication utility for Go.', 'Go', 3, 1
  WHERE NOT EXISTS (SELECT 1 FROM `projects` WHERE `name` = 'hydrate');
--> statement-breakpoint
INSERT INTO `projects` (`name`, `url`, `description`, `stack`, `sort_order`, `visible`)
  SELECT 'davidoduneye.com', 'https://github.com/DOOduneye/portfolio', 'This site. A React app with a built-in CMS, using tRPC on Cloudflare Workers, D1, and a TipTap editor.', 'React · tRPC · Cloudflare · TipTap', 4, 1
  WHERE NOT EXISTS (SELECT 1 FROM `projects` WHERE `name` = 'davidoduneye.com');
