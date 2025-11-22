import axios from "axios";
import { Repository } from "./repository";
import { DND_API_BASE_URL } from "../../utils/constants";

const CLASS_COLORS: Record<string, string> = {
  barbarian: "#D04444",
  bard: "#C54BCF",
  cleric: "#E0A92C",
  druid: "#4CA65A",
  fighter: "#888888",
  monk: "#2EB398",
  paladin: "#FFD700",
  ranger: "#1E6F2E",
  rogue: "#2E2E2E",
  sorcerer: "#D12E6A",
  warlock: "#6B1AA8",
  wizard: "#1A4BD1",
};

export class Service {
  static async importAll() {
    const list = await axios.get(`${DND_API_BASE_URL}/api/classes`);
    const classes = list.data.results;

    const inserted = [];

    for (const c of classes) {
      try {
        const full = await axios.get(`${DND_API_BASE_URL}${c.url}`);
        const cls = full.data;

        const index = cls.index.toLowerCase();

        const data = {
          name: cls.name,
          color: CLASS_COLORS[index] || null,
          image: `/classes/${cls.name}.svg`,
        };

        const result = await Repository.insert(data);
        inserted.push(result);
      } catch (e) {
        console.log("Error importing", c.index);
      }
    }

    return { imported: inserted.length };
  }
}
