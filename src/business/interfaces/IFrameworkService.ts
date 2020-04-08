import {
  FrameworkExpanded,
  FrameworkReceived
} from "../../api/objects/frameworks";

export interface IFrameworkService {
  getFrameworks(): Promise<FrameworkReceived[]>;
  getFrameworkById(frameworkId: string): Promise<FrameworkExpanded>;
}
