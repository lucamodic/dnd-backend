import { CrudRepository } from "../../utils/crud-repository";

export type PlayerInsert = {
  name: string;
};

const PLAYER_SELECT = `
  *,
  characters:character(
    *,
    campaign:campaign_id(*),
    class:class_id(*)
  )
`;

const repo = new CrudRepository<PlayerInsert>("player", PLAYER_SELECT, {
  orderBy: { column: "created_at", ascending: false },
});

export class Repository {
  static list() {
    return repo.findAll();
  }

  static getById(id: string) {
    return repo.findById(id);
  }

  static create(data: PlayerInsert) {
    return repo.insert(data);
  }

  static update(id: string, data: Partial<PlayerInsert>) {
    return repo.update(id, data);
  }

  static delete(id: string) {
    return repo.delete(id);
  }
}
