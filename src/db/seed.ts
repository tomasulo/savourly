import type { Client } from "@libsql/client";

interface SeedRecipe {
  title: string;
  description: string;
  cuisine: string;
  difficulty: "easy" | "medium" | "hard";
  prep_time_minutes: number;
  cook_time_minutes: number;
  servings: number;
  image_url: string;
  ingredients: { name: string; amount: number; unit: string }[];
  instructions: string[];
}

const recipes: SeedRecipe[] = [
  {
    title: "Wiener Schnitzel",
    description:
      "Zart geklopftes Kalbsfleisch in goldener Panade – der Klassiker der österreichischen und deutschen Küche.",
    cuisine: "Österreichisch",
    difficulty: "medium",
    prep_time_minutes: 20,
    cook_time_minutes: 15,
    servings: 4,
    image_url:
      "https://images.unsplash.com/photo-1599921841143-819065a55cc6?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Kalbsschnitzel", amount: 600, unit: "g" },
      { name: "Mehl", amount: 80, unit: "g" },
      { name: "Eier", amount: 2, unit: "Stück" },
      { name: "Semmelbrösel", amount: 150, unit: "g" },
      { name: "Butterschmalz", amount: 200, unit: "ml" },
      { name: "Zitrone", amount: 1, unit: "Stück" },
      { name: "Salz", amount: 1, unit: "TL" },
      { name: "Pfeffer", amount: 0.5, unit: "TL" },
    ],
    instructions: [
      "Die Kalbsschnitzel zwischen zwei Lagen Frischhaltefolie auf etwa 4 mm Dicke klopfen.",
      "Drei tiefe Teller bereitstellen: einen mit Mehl, einen mit verquirlten Eiern und einen mit Semmelbröseln.",
      "Die Schnitzel salzen und pfeffern, dann nacheinander in Mehl, Ei und Semmelbröseln wenden. Die Panade leicht andrücken.",
      "Butterschmalz in einer großen Pfanne auf etwa 170 °C erhitzen – ein Brotstück sollte sofort sizzeln.",
      "Die Schnitzel portionsweise 2–3 Minuten pro Seite goldbraun ausbacken. Dabei die Pfanne leicht schwenken, damit das Fett über das Schnitzel schwappt.",
      "Auf Küchenpapier abtropfen lassen und sofort mit Zitronenscheiben und Petersilienkartoffeln servieren.",
    ],
  },
  {
    title: "Sauerbraten",
    description:
      "Marinierter Rinderbraten aus dem Rheinland – mehrere Tage in Essig-Rotwein-Marinade eingelegt und dann langsam geschmort.",
    cuisine: "Deutsch",
    difficulty: "hard",
    prep_time_minutes: 30,
    cook_time_minutes: 180,
    servings: 6,
    image_url:
      "https://images.unsplash.com/photo-1529042410759-befb1204b468?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Rinderbraten (Schulter oder Keule)", amount: 1500, unit: "g" },
      { name: "Rotweinessig", amount: 250, unit: "ml" },
      { name: "Trockener Rotwein", amount: 250, unit: "ml" },
      { name: "Wasser", amount: 500, unit: "ml" },
      { name: "Zwiebeln", amount: 2, unit: "Stück" },
      { name: "Möhren", amount: 2, unit: "Stück" },
      { name: "Lorbeerblätter", amount: 3, unit: "Stück" },
      { name: "Pfefferkörner", amount: 10, unit: "Stück" },
      { name: "Nelken", amount: 4, unit: "Stück" },
      { name: "Zucker", amount: 2, unit: "EL" },
      { name: "Rosinen", amount: 50, unit: "g" },
      { name: "Lebkuchen (dunkel)", amount: 50, unit: "g" },
      { name: "Schmalz", amount: 2, unit: "EL" },
    ],
    instructions: [
      "Essig, Rotwein und Wasser mit Zwiebeln, Möhren, Lorbeer, Pfefferkörnern und Nelken aufkochen. Abkühlen lassen.",
      "Den Rinderbraten in die abgekühlte Marinade legen. Mindestens 3 Tage im Kühlschrank marinieren, täglich wenden.",
      "Den Braten aus der Marinade nehmen, trocken tupfen. Marinade durch ein Sieb gießen und aufbewahren.",
      "Schmalz in einem Schmortopf erhitzen. Den Braten von allen Seiten kräftig anbraten.",
      "Das Gemüse aus der Marinade zugeben und kurz mitbraten. Mit der Marinade ablöschen.",
      "Zucker und Rosinen zugeben. Den Braten bei 160 °C im Ofen 2,5–3 Stunden schmoren, bis er zart ist.",
      "Den Braten herausnehmen. Die Soße mit zerbröseltem Lebkuchen eindicken, abschmecken und zum Braten reichen.",
    ],
  },
  {
    title: "Käsespätzle",
    description:
      "Hausgemachte Spätzle mit geschmolzenem Bergkäse und knusprigen Röstzwiebeln – der Liebling aus dem Schwabenland.",
    cuisine: "Schwäbisch",
    difficulty: "medium",
    prep_time_minutes: 20,
    cook_time_minutes: 25,
    servings: 4,
    image_url:
      "https://images.unsplash.com/photo-1551183053-bf91798d9d38?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Mehl (Type 405)", amount: 400, unit: "g" },
      { name: "Eier", amount: 4, unit: "Stück" },
      { name: "Milch", amount: 150, unit: "ml" },
      { name: "Salz", amount: 1.5, unit: "TL" },
      { name: "Muskatnuss", amount: 0.5, unit: "TL" },
      { name: "Bergkäse (gerieben)", amount: 250, unit: "g" },
      { name: "Zwiebeln", amount: 3, unit: "Stück" },
      { name: "Butter", amount: 40, unit: "g" },
      { name: "Öl", amount: 2, unit: "EL" },
    ],
    instructions: [
      "Mehl, Eier, Milch, Salz und Muskatnuss zu einem zähen, blasenwerfenden Teig verrühren. 10 Minuten ruhen lassen.",
      "Einen großen Topf gesalzenes Wasser zum Kochen bringen.",
      "Den Teig portionsweise durch ein Spätzlesieb oder Spätzlebrett ins kochende Wasser schaben. Sobald die Spätzle oben schwimmen, mit einer Schaumkelle herausheben.",
      "Zwiebeln in feine Ringe schneiden. In Butter und Öl bei mittlerer Hitze 15–20 Minuten goldbraun rösten.",
      "Eine ofenfeste Form buttern. Spätzle und Käse abwechselnd einschichten, mit Käse abschließen.",
      "Im vorgeheizten Ofen bei 180 °C (Umluft) 10–15 Minuten überbacken, bis der Käse blubbert und goldbraun ist.",
      "Mit den Röstzwiebeln garnieren und sofort heiß servieren.",
    ],
  },
  {
    title: "Rinderrouladen",
    description:
      "Dünne Rindfleischstreifen, gefüllt mit Senf, Speck und Gewürzgurke, langsam in kräftiger Soße geschmort.",
    cuisine: "Deutsch",
    difficulty: "hard",
    prep_time_minutes: 30,
    cook_time_minutes: 120,
    servings: 4,
    image_url:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Rinderrouladen (dünn geschnitten)", amount: 4, unit: "Stück" },
      { name: "Mittelscharfer Senf", amount: 4, unit: "EL" },
      { name: "Bauchspeck (in Scheiben)", amount: 100, unit: "g" },
      { name: "Gewürzgurken", amount: 4, unit: "Stück" },
      { name: "Zwiebeln", amount: 2, unit: "Stück" },
      { name: "Möhren", amount: 1, unit: "Stück" },
      { name: "Sellerie", amount: 100, unit: "g" },
      { name: "Tomatenmark", amount: 2, unit: "EL" },
      { name: "Rotwein", amount: 200, unit: "ml" },
      { name: "Rinderbrühe", amount: 400, unit: "ml" },
      { name: "Öl", amount: 2, unit: "EL" },
      { name: "Salz und Pfeffer", amount: 1, unit: "Prise" },
    ],
    instructions: [
      "Das Fleisch auf einer Arbeitsfläche ausbreiten, salzen und pfeffern. Jede Roulade mit einem EL Senf bestreichen.",
      "Speckscheiben, eine halbe Zwiebel in Ringen und je eine Gewürzgurke auf das Fleisch legen.",
      "Das Fleisch straff aufrollen und mit Küchengarn oder Rouladennadeln fixieren.",
      "Öl in einem Schmortopf erhitzen. Die Rouladen von allen Seiten kräftig anbraten, dann herausnehmen.",
      "Restliche Zwiebeln, Möhren und Sellerie klein schneiden, im Topf anschwitzen. Tomatenmark zugeben und kurz mitrösten.",
      "Mit Rotwein ablöschen, dann Brühe angießen. Die Rouladen zurückgeben und zugedeckt bei 160 °C 1,5–2 Stunden schmoren.",
      "Die Rouladen herausnehmen. Die Soße pürieren, abschmecken und zu den Rouladen mit Rotkohl und Kartoffelknödeln reichen.",
    ],
  },
  {
    title: "Kartoffelsuppe",
    description:
      "Deftige, cremige Kartoffelsuppe mit Gemüse und Majoran – einfache deutsche Hausmannskost vom Feinsten.",
    cuisine: "Deutsch",
    difficulty: "easy",
    prep_time_minutes: 15,
    cook_time_minutes: 35,
    servings: 4,
    image_url:
      "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Mehligkochende Kartoffeln", amount: 800, unit: "g" },
      { name: "Zwiebel", amount: 1, unit: "Stück" },
      { name: "Möhren", amount: 2, unit: "Stück" },
      { name: "Sellerie", amount: 100, unit: "g" },
      { name: "Gemüsebrühe", amount: 1000, unit: "ml" },
      { name: "Sahne", amount: 100, unit: "ml" },
      { name: "Butter", amount: 30, unit: "g" },
      { name: "Getrockneter Majoran", amount: 1, unit: "TL" },
      { name: "Lorbeerblatt", amount: 1, unit: "Stück" },
      { name: "Salz und Pfeffer", amount: 1, unit: "Prise" },
      { name: "Schnittlauch", amount: 1, unit: "Bund" },
    ],
    instructions: [
      "Kartoffeln, Möhren und Sellerie schälen und in grobe Würfel schneiden. Zwiebel fein hacken.",
      "Butter in einem großen Topf erhitzen. Zwiebel darin glasig dünsten.",
      "Kartoffeln, Möhren und Sellerie zugeben, kurz mit andünsten.",
      "Mit Gemüsebrühe ablöschen. Majoran und Lorbeerblatt zugeben. 20–25 Minuten köcheln lassen, bis das Gemüse weich ist.",
      "Das Lorbeerblatt entfernen. Die Hälfte der Suppe mit einem Stabmixer pürieren, die andere Hälfte stückig lassen.",
      "Sahne unterrühren und die Suppe mit Salz und Pfeffer abschmecken.",
      "Mit frisch geschnittenem Schnittlauch bestreuen und mit Bauernbrot servieren.",
    ],
  },
  {
    title: "Flammkuchen",
    description:
      "Knuspriger Elsässer Flammkuchen mit Crème fraîche, Speck und Zwiebeln – in 35 Minuten auf dem Tisch.",
    cuisine: "Elsässisch",
    difficulty: "easy",
    prep_time_minutes: 20,
    cook_time_minutes: 15,
    servings: 4,
    image_url:
      "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Mehl (Type 550)", amount: 250, unit: "g" },
      { name: "Wasser (lauwarm)", amount: 150, unit: "ml" },
      { name: "Öl", amount: 3, unit: "EL" },
      { name: "Salz", amount: 0.5, unit: "TL" },
      { name: "Crème fraîche", amount: 200, unit: "g" },
      { name: "Zwiebeln", amount: 2, unit: "Stück" },
      { name: "Geräucherter Bauchspeck (Lardons)", amount: 150, unit: "g" },
      { name: "Pfeffer", amount: 0.5, unit: "TL" },
      { name: "Muskatnuss", amount: 0.25, unit: "TL" },
    ],
    instructions: [
      "Mehl, Wasser, Öl und Salz zu einem glatten Teig kneten. 10 Minuten bei Raumtemperatur ruhen lassen.",
      "Den Ofen mit einem Backblech oder Pizzastein auf 250 °C Ober-/Unterhitze vorheizen.",
      "Den Teig auf einer bemehlten Fläche hauchdünn zu einem Rechteck ausrollen.",
      "Crème fraîche mit Salz, Pfeffer und Muskat verrühren und gleichmäßig auf dem Teig verstreichen.",
      "Zwiebeln in feine Ringe schneiden und auf dem Flammkuchen verteilen. Speck darüber streuen.",
      "Den Flammkuchen auf das heiße Backblech legen und 12–15 Minuten backen, bis der Rand knusprig ist und der Belag leicht gebräunt ist.",
      "Sofort heiß servieren – am besten mit einem kühlen Elsässer Riesling.",
    ],
  },
  {
    title: "Erbsensuppe mit Würstchen",
    description:
      "Herzhafter Eintopf mit getrockneten Erbsen, Räucherspeck und Würstchen – ein klassisches deutsches Wintergericht.",
    cuisine: "Deutsch",
    difficulty: "easy",
    prep_time_minutes: 10,
    cook_time_minutes: 75,
    servings: 6,
    image_url:
      "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Getrocknete Schälerbsen (gelb)", amount: 400, unit: "g" },
      { name: "Räucherspeck", amount: 150, unit: "g" },
      { name: "Wiener Würstchen", amount: 6, unit: "Stück" },
      { name: "Zwiebeln", amount: 2, unit: "Stück" },
      { name: "Möhren", amount: 2, unit: "Stück" },
      { name: "Kartoffeln", amount: 300, unit: "g" },
      { name: "Sellerie", amount: 100, unit: "g" },
      { name: "Gemüsebrühe", amount: 1500, unit: "ml" },
      { name: "Getrockneter Majoran", amount: 1, unit: "TL" },
      { name: "Lorbeerblatt", amount: 1, unit: "Stück" },
      { name: "Salz und Pfeffer", amount: 1, unit: "Prise" },
    ],
    instructions: [
      "Die Erbsen über Nacht in reichlich kaltem Wasser einweichen. Vor dem Kochen abgießen.",
      "Speck, Zwiebeln, Möhren, Kartoffeln und Sellerie in Würfel schneiden.",
      "Speck in einem großen Topf auslassen. Zwiebeln darin glasig schwitzen.",
      "Erbsen, Gemüse und Brühe zugeben. Lorbeerblatt und Majoran dazugeben.",
      "Aufkochen, dann bei schwacher Hitze 60 Minuten köcheln lassen, bis die Erbsen zerfallen.",
      "Das Lorbeerblatt entfernen. Die Suppe mit einem Kartoffelstampfer oder Stabmixer nach Geschmack anpürieren.",
      "Die Würstchen in Scheiben schneiden, zugeben und 5 Minuten erwärmen. Mit Salz und Pfeffer abschmecken.",
    ],
  },
  {
    title: "Pfannkuchen",
    description:
      "Dünne, zarte Pfannkuchen nach Omas Rezept – herrlich mit Marmelade, Zucker und Zimt oder herzhaft gefüllt.",
    cuisine: "Deutsch",
    difficulty: "easy",
    prep_time_minutes: 10,
    cook_time_minutes: 20,
    servings: 4,
    image_url:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Mehl (Type 405)", amount: 200, unit: "g" },
      { name: "Eier", amount: 3, unit: "Stück" },
      { name: "Milch", amount: 400, unit: "ml" },
      { name: "Butter (geschmolzen)", amount: 30, unit: "g" },
      { name: "Salz", amount: 0.5, unit: "TL" },
      { name: "Zucker", amount: 1, unit: "EL" },
      { name: "Butter (zum Braten)", amount: 40, unit: "g" },
    ],
    instructions: [
      "Mehl und Salz in eine Schüssel sieben. In der Mitte eine Mulde bilden.",
      "Eier, Milch und geschmolzene Butter zugeben und zu einem glatten, dünnflüssigen Teig verrühren. 10 Minuten quellen lassen.",
      "Eine beschichtete Pfanne (ca. 24 cm) bei mittlerer Hitze erhitzen. Ein Stück Butter hineingeben.",
      "Eine Kelle Teig in die Pfanne geben und durch Schwenken gleichmäßig verteilen.",
      "Den Pfannkuchen 1–2 Minuten backen, bis die Oberfläche matt wird und die Ränder sich lösen.",
      "Wenden und weitere 30–60 Sekunden goldbraun backen. Warm stellen.",
      "Mit Marmelade, Zucker und Zimt oder Apfelmus servieren.",
    ],
  },
  {
    title: "Apfelstrudel",
    description:
      "Knuspriger Strudel mit gewürzten Äpfeln und Rosinen im hauchdünnen Strudelteig – der Klassiker aus Wien.",
    cuisine: "Österreichisch",
    difficulty: "medium",
    prep_time_minutes: 45,
    cook_time_minutes: 35,
    servings: 8,
    image_url:
      "https://images.unsplash.com/photo-1601000938259-bf5c4f2ae53c?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Mehl (Type 550)", amount: 250, unit: "g" },
      { name: "Lauwarmes Wasser", amount: 130, unit: "ml" },
      { name: "Öl", amount: 3, unit: "EL" },
      { name: "Salz", amount: 0.5, unit: "TL" },
      { name: "Säuerliche Äpfel (z.B. Boskoop)", amount: 1000, unit: "g" },
      { name: "Zucker", amount: 80, unit: "g" },
      { name: "Zimtpulver", amount: 1.5, unit: "TL" },
      { name: "Rosinen", amount: 80, unit: "g" },
      { name: "Semmelbrösel", amount: 60, unit: "g" },
      { name: "Butter", amount: 80, unit: "g" },
      { name: "Puderzucker", amount: 2, unit: "EL" },
    ],
    instructions: [
      "Mehl, Wasser, Öl und Salz zu einem glatten, geschmeidigen Teig kneten. In Öl einwickeln und 30 Minuten bei Raumtemperatur ruhen lassen.",
      "Äpfel schälen, entkernen und in dünne Scheiben schneiden. Mit Zucker, Zimt und Rosinen vermengen.",
      "Die Hälfte der Butter in einer Pfanne erhitzen. Semmelbrösel darin goldbraun rösten.",
      "Ein großes Küchentuch auf dem Tisch ausbreiten und bemehlen. Den Teig darauf hauchdünn ausziehen, bis er fast transparent ist.",
      "Die restliche Butter schmelzen und den Teig damit bestreichen. Geröstete Semmelbrösel auf zwei Dritteln des Teigs verteilen.",
      "Die Äpfelmischung auf den Semmelbröseln verteilen. Mithilfe des Tuches den Strudel straff aufrollen und auf ein Backblech legen.",
      "Mit Butter bestreichen und im vorgeheizten Ofen bei 190 °C 30–35 Minuten goldbraun backen. Mit Puderzucker bestäuben und mit Vanillesoße oder Schlagsahne servieren.",
    ],
  },
  {
    title: "Schwarzwälder Kirschtorte",
    description:
      "Saftiger Schokoladenbiskuit, luftige Schlagsahne und Kirschen mit Kirschwasser – die wohl berühmteste Torte Deutschlands.",
    cuisine: "Deutsch",
    difficulty: "hard",
    prep_time_minutes: 60,
    cook_time_minutes: 30,
    servings: 12,
    image_url:
      "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&auto=format&fit=crop",
    ingredients: [
      { name: "Eier", amount: 6, unit: "Stück" },
      { name: "Zucker", amount: 150, unit: "g" },
      { name: "Mehl (Type 405)", amount: 100, unit: "g" },
      { name: "Kakaopulver (ungesüßt)", amount: 50, unit: "g" },
      { name: "Backpulver", amount: 1, unit: "TL" },
      { name: "Geschmorte Sauerkirschen (Glas)", amount: 700, unit: "g" },
      { name: "Kirschwasser", amount: 6, unit: "EL" },
      { name: "Schlagsahne", amount: 600, unit: "ml" },
      { name: "Sahnesteif", amount: 2, unit: "Päckchen" },
      { name: "Zucker (für Sahne)", amount: 40, unit: "g" },
      { name: "Schokoraspeln (dunkel)", amount: 100, unit: "g" },
    ],
    instructions: [
      "Eier und Zucker mit dem Handrührgerät 8–10 Minuten hell und schaumig schlagen. Mehl, Kakao und Backpulver sieben und behutsam unterheben.",
      "Den Teig in eine gefettete Springform (26 cm) füllen. Im vorgeheizten Ofen bei 175 °C 28–30 Minuten backen. Auskühlen lassen.",
      "Die Kirschen abtropfen lassen, dabei den Saft auffangen. 200 ml Kirschsaft mit Kirschwasser verrühren.",
      "Den Biskuit dreimal waagerecht durchschneiden (4 Böden). Jeden Boden mit der Kirschsaft-Mischung tränken.",
      "Sahne mit Sahnesteif und Zucker steif schlagen.",
      "Den ersten Boden mit Sahne bestreichen, Kirschen darüber verteilen. Nächsten Boden auflegen und so fortfahren. Den letzten Boden auflegen.",
      "Die Torte rundherum mit Sahne einstreichen. Mit Schokoraspeln und Sahnerosetten dekorieren. Mindestens 2 Stunden kühlen.",
    ],
  },
];

export async function seedDatabase(db: Client): Promise<void> {
  const result = await db.execute("SELECT COUNT(*) as count FROM recipes");
  const recipeCount = result.rows[0][0] as number;

  if (recipeCount > 0) {
    return;
  }

  // Insert recipes one by one since we need lastInsertRowid for each
  for (const recipe of recipes) {
    const result = await db.execute({
      sql: `INSERT INTO recipes (title, description, cuisine, difficulty, prep_time_minutes, cook_time_minutes, servings, image_url)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        recipe.title,
        recipe.description,
        recipe.cuisine,
        recipe.difficulty,
        recipe.prep_time_minutes,
        recipe.cook_time_minutes,
        recipe.servings,
        recipe.image_url,
      ],
    });
    const recipeId = result.lastInsertRowid;

    // Batch insert ingredients
    const ingredientStatements = recipe.ingredients.map((ing, index) => ({
      sql: `INSERT INTO ingredients (recipe_id, name, amount, unit, order_index)
            VALUES (?, ?, ?, ?, ?)`,
      args: [recipeId as number | bigint, ing.name, ing.amount, ing.unit, index] as (string | number | bigint)[],
    }));

    if (ingredientStatements.length > 0) {
      await db.batch(ingredientStatements, "write");
    }

    // Batch insert instructions
    const instructionStatements = recipe.instructions.map(
      (content, index) => ({
        sql: `INSERT INTO instructions (recipe_id, step_number, content)
              VALUES (?, ?, ?)`,
        args: [recipeId as number | bigint, index + 1, content] as (string | number | bigint)[],
      })
    );

    if (instructionStatements.length > 0) {
      await db.batch(instructionStatements, "write");
    }
  }
}
