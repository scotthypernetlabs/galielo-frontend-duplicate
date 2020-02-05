export interface IProjectRepository {
  createProject(name: string, description: string): Promise<void>;
}
