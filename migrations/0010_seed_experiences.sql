INSERT INTO `experiences` (`role`, `org`, `org_url`, `dates`, `description`, `sort_order`, `visible`)
  SELECT 'Member of Technical Staff', 'Agency', 'https://www.agency.inc', 'Jan 2025 - Present', 'Early engineer building the core product.', 0, 1
  WHERE NOT EXISTS (SELECT 1 FROM `experiences` WHERE `role` = 'Member of Technical Staff' AND `org` = 'Agency');
--> statement-breakpoint
INSERT INTO `experiences` (`role`, `org`, `org_url`, `dates`, `description`, `sort_order`, `visible`)
  SELECT 'Software Engineering Intern', 'Google', 'https://about.google', 'Aug - Nov 2024', 'Worked on Google''s CI tooling for the onArm initiative, adding multi-architecture (ARM and x86) test visibility for internal developers.', 1, 1
  WHERE NOT EXISTS (SELECT 1 FROM `experiences` WHERE `role` = 'Software Engineering Intern' AND `org` = 'Google');
--> statement-breakpoint
INSERT INTO `experiences` (`role`, `org`, `org_url`, `dates`, `description`, `sort_order`, `visible`)
  SELECT 'Software Engineering Intern', 'Microsoft', 'https://www.microsoft.com', 'May - Aug 2024', 'Improved a synthetic data generator with multithreading and a move to cloud VMs, added tests in production for pipeline validation, and built a dashboard for monitoring test runs across production regions.', 2, 1
  WHERE NOT EXISTS (SELECT 1 FROM `experiences` WHERE `role` = 'Software Engineering Intern' AND `org` = 'Microsoft');
--> statement-breakpoint
INSERT INTO `experiences` (`role`, `org`, `org_url`, `dates`, `description`, `sort_order`, `visible`)
  SELECT 'Technical Lead', 'Generate', 'https://generatenu.com', 'Jul 2023 - Jun 2024', 'Led a team of 5 to 10 engineers building four full-stack applications for student clubs and events.', 3, 1
  WHERE NOT EXISTS (SELECT 1 FROM `experiences` WHERE `role` = 'Technical Lead' AND `org` = 'Generate');
