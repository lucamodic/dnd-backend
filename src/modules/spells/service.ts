import axios from "axios";
import { Repository } from "./repository";
import { Repository as ClassRepository } from "../classes/repository";

import { DND_API_BASE_URL } from "../../utils/constants";
import { ClassSpellRepository } from "./repository-class-spell";

export class Service {
  static async list() {
    return Repository.list();
  }

  static async show(id: string) {
    if (!id) {
      return { status: 400, error: "Spell id is required" };
    }
    return Repository.getById(id);
  }

  static async importAll() {
    const list = await axios.get(`${DND_API_BASE_URL}/api/spells`);
    const spells = list.data.results;

    let inserted = 0;

    for (const s of spells) {
      try {
        const full = await axios.get(`${DND_API_BASE_URL}${s.url}`);
        const sp = full.data;

        const data = {
          index: sp.index,
          name: sp.name,
          level: sp.level,
          school: sp.school.name,
          casting_time: sp.casting_time,
          range: sp.range,
          duration: sp.duration,
          components: sp.components || [],
          material: sp.material || null,
          concentration: !!sp.concentration,
          ritual: !!sp.ritual,
          description: sp.desc || [],
          higher_level: sp.higher_level || null,
        };

        const spellInsertResult = await Repository.insert(data);

        if ("error" in spellInsertResult) {
          console.log("Failed to insert spell:", s.index, "-", spellInsertResult.error);
          continue;
        }

        const spellInserted = spellInsertResult.data as typeof data & { id?: string };
        if (!spellInserted?.id) {
          console.log("Failed to insert spell:", s.index, "- missing id");
          continue;
        }

        for (const cl of sp.classes || []) {
          const classRecord = await ClassRepository.getByIndex(cl.index);
          if (classRecord) {
            await ClassSpellRepository.insert({
              class_id: classRecord.id,
              spell_id: spellInserted.id,
            });
          }
        }

        inserted++;
      } catch (err) {
        console.log("Error importing spell:", s.index);
      }
    }

    return { imported: inserted };
  }
}
