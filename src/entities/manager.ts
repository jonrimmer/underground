export class EntityManager {
  private id = 1;

  createEntity(factory: (id: number) => void) {
    this.id++;
    return factory(this.id);
  }
}
