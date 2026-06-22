import type { ComponentType } from "react";
import TheMentalModel from "./the-mental-model.mdx";
import Skills from "./skills.mdx";
import Agents from "./agents.mdx";
import Memory from "./memory.mdx";
import Sparc from "./sparc.mdx";
import Swarms from "./swarms.mdx";
import HooksAndWorkers from "./hooks-and-workers.mdx";
import HiveMindAndMcp from "./hive-mind-and-mcp.mdx";
import GithubAutomation from "./github-automation.mdx";

/** Maps a lesson slug to its MDX content component. */
export const LESSON_CONTENT: Record<string, ComponentType> = {
  "the-mental-model": TheMentalModel,
  skills: Skills,
  agents: Agents,
  memory: Memory,
  sparc: Sparc,
  swarms: Swarms,
  "hooks-and-workers": HooksAndWorkers,
  "hive-mind-and-mcp": HiveMindAndMcp,
  "github-automation": GithubAutomation,
};
