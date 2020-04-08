import {
  FrameworkExpanded,
  FrameworkReceived
} from "../../api/objects/frameworks";

export interface IFrameworkRepository {
  getFrameworks(): Promise<FrameworkReceived[]>;
  getFrameworkById(frameworkId: string): Promise<FrameworkExpanded>;
}
