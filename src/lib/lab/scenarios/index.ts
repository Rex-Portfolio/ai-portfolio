import type { Scenario } from "../engine";
import { kestrel } from "./kestrel";
import { lumen } from "./lumen";
import { tandem } from "./tandem";

export const scenarios: Scenario[] = [kestrel, lumen, tandem];
