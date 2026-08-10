import { db } from "./index";
import { resources } from "./schema";
import * as dotenv from "dotenv";
dotenv.config();

async function seed() {
  console.log("Seeding resources...");

  await db.insert(resources).values([
    {
      name:         "Silang Rural Health Unit",
      organization: "LGU Silang",
      category:     "health",
      address:      "Barangay Biga, Silang, Cavite",
      barangay:     "Biga",
      city:         "Silang",
      province:     "Cavite",
      phone:        "(046) 686-0019",
      hours:        "Monday–Friday, 8:00 AM – 5:00 PM",
      cost:         "free",
      description:  "Free consultations, vaccines, and basic medicine for Silang residents.",
      lat:          "14.2301",
      lng:          "120.9758",
      status:       "active",
      verified:     true,
    },
    {
      name:         "Ospital ng Silang",
      organization: "LGU Silang",
      category:     "health",
      address:      "Poblacion, Silang, Cavite",
      barangay:     "Poblacion",
      city:         "Silang",
      province:     "Cavite",
      phone:        "(046) 686-1234",
      hours:        "Open 24 hours, 7 days a week",
      cost:         "free",
      description:  "Community hospital serving Silang and nearby towns.",
      lat:          "14.2265",
      lng:          "120.9741",
      status:       "active",
      verified:     true,
    },
    {
      name:         "PESO Livelihood Office",
      organization: "Municipality of Silang",
      category:     "livelihood",
      address:      "Municipal Hall, Silang, Cavite",
      barangay:     "Poblacion",
      city:         "Silang",
      province:     "Cavite",
      phone:        "(046) 686-5678",
      hours:        "Monday–Thursday, 8:00 AM – 4:00 PM",
      cost:         "free",
      description:  "Job placement, livelihood programs, and skills training for residents.",
      lat:          "14.2250",
      lng:          "120.9755",
      status:       "active",
      verified:     true,
    },
    {
      name:         "MSWD – Social Welfare Office",
      organization: "Municipality of Silang",
      category:     "food_relief",
      address:      "Municipal Hall, Silang, Cavite",
      barangay:     "Poblacion",
      city:         "Silang",
      province:     "Cavite",
      phone:        "(046) 686-9012",
      hours:        "Monday–Friday, 8:00 AM – 5:00 PM",
      cost:         "free",
      description:  "Ayuda, relief goods, and social protection programs for those in need.",
      lat:          "14.2255",
      lng:          "120.9748",
      status:       "active",
      verified:     true,
    },
    {
      name:         "PAO – Public Attorney's Office",
      organization: "Department of Justice",
      category:     "legal_aid",
      address:      "Imus, Cavite (covers Silang)",
      barangay:     null,
      city:         "Imus",
      province:     "Cavite",
      phone:        "(046) 471-3456",
      hours:        "Monday–Friday, 8:00 AM – 5:00 PM",
      cost:         "free",
      description:  "Free legal representation and consultation for those who cannot afford a lawyer.",
      lat:          "14.2290",
      lng:          "120.9720",
      status:       "active",
      verified:     true,
    },
    {
      name:         "In Touch Community Services",
      organization: "In Touch Community Services, Inc.",
      category:     "mental_health",
      address:      "Online / Hotline – Available nationwide",
      barangay:     null,
      city:         "Silang",
      province:     "Cavite",
      phone:        "0917-800-1123",
      hours:        "Open 24 hours, 7 days a week",
      cost:         "free",
      description:  "Free and confidential mental health support hotline. Talk to a counselor anytime.",
      lat:          "14.2273",
      lng:          "120.9741",
      status:       "active",
      verified:     true,
    },
  ]).onConflictDoNothing();

  console.log("Seeding complete.");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
