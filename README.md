# ☕ Kopi Dash — Malaysian Cooking Dash (Kopitiam & Mamak Rush)

An authentic Malaysian culinary adaptation of the classic **Cooking Dash / Diner Dash** time-management arcade game, hosted at **[https://play.kopipeng.online](https://play.kopipeng.online)**.

Uncle Chef runs the busiest Kopitiam in town! Seat rushed executives, patient Makciks, hungry students, and curious tourists, cook authentic Malaysian hawker staples across multiple kitchen stations, prevent wok-hei disasters, and unleash powerful boosters.

---

## 🍳 Authentic Malaysian Dishes (1-to-1 Cooking Dash Replacements)

All original Diner/Cooking Dash dishes have been replaced with beloved Malaysian Kopitiam, Mamak, and Pasar Malam specialties:

| Malaysian Dish | Workstation | Authentic Components & Preparation |
| :--- | :--- | :--- |
| **Nasi Lemak Special** | Deep Fryer & Plating | Crispy Ayam Goreng Berempah, santan coconut rice on banana leaf, sambal, boiled egg, anchovies & peanuts. |
| **Penang Char Kway Teow** | High-Heat Wok 1 | Stir-fried flat rice noodles with intense wok-hei, king prawns, kerang (cockles), bean sprouts, and chives. |
| **Crispy Roti Canai** | Cast-Iron Griddle | Fluffy, flaky layered flatbread folded and served with warm dhal curry and spicy sambal. |
| **Roti Telur Special** | Cast-Iron Griddle | Savory roti folded with whipped egg and red onion filling, served with rich dhal dip. |
| **Kajang Satay Skewers** | Charcoal Grill | Lemongrass-marinated chicken skewers charred over hot coals, served with rich peanut sauce and cucumber. |
| **Mee Goreng Mamak** | High-Heat Wok 2 | Spicy wok-tossed yellow noodles with fried tofu fritters, egg, green chili, and fresh calamansi lime. |
| **Nyonya Curry Laksa** | Simmering Soup Pot | Springy noodles in rich aromatic coconut curry broth, tofu puffs, prawns, and fresh mint leaves. |

### ☕ Kopitiam Drinks Dispenser
- **Teh Tarik ("Pulled Tea")**: Malaysian Ceylon black tea vigorously pulled with sweet condensed milk for thick froth.
- **Kopi Peng**: Chilled dark Hainanese roast coffee served over ice with condensed milk.
- **Milo Dinosaur**: Ice-cold malt chocolate drink crowned with an avalanche of raw Milo powder.
- **Sirap Bandung Soda**: Vibrant rose syrup beverage blended with evaporated milk and chilled ice.

### 🥟 Instant Patience Treats
- **Crispy Karipap (Curry Puff)**: Pleated golden pastry filled with spiced curry potato. Restores +40% customer hearts!
- **Rainbow Kuih Lapis**: Multi-layered steamed coconut pandan cake. Restores +50% customer hearts!

---

## ⚡ Cooking Dash Skills & Boosters

Activate using bottom HUD buttons or keyboard hotkeys `[1]` to `[5]`:
1. `[1]` **Kasut Laju (Speed Boost)**: Uncle Chef dashes at +70% speed across all stations for 18s.
2. `[2]` **Wok Emas (Anti-Burn Magic)**: Golden aura prevents all woks and griddles from burning dishes for 22s.
3. `[3]` **Api Besar (Instant Cook)**: Fire blast instantly completes cooking for everything currently on the stoves.
4. `[4]` **Lagu P. Ramlee (Patience Max)**: Lively vintage music instantly restores ALL customer hearts to 100%.
5. `[5]` **Demam Untung (Double Tips)**: Customers pay 2X coins and tips on every dish served for 15s.

---

## 🎮 How to Play & Controls

- **Click-to-Queue Movement**: Click multiple stations and tables to chain actions smoothly.
- **Start Cooking**: Click an idle wok, fryer, griddle, or pot to start cooking.
- **Pick Up & Plate**: Click the appliance when the cooking timer completes (green check). Don't let it overcook into black smoke!
- **Seat Customers**: Click an available table when customers are queued at the entrance.
- **Serve Food**: Deliver the dish and drink matching the customer's order bubble before their patience hearts run out.
- **Collect Cash & Clear Plates**: Click dirty tables to bank your earnings and carry dirty plates to the wash basin.
- **Trash Can**: Discard burnt or mistaken items.

---

## 🛒 Kitchen Upgrades Shop

Spend earned Ringgits (RM) between shifts to upgrade:
- **3-Dish Serving Platter**: Carry up to 3 dishes and drinks simultaneously instead of 2.
- **Mamak High-Pressure Burners**: +30% stir-fry speed on woks and griddles.
- **Kasut Getah Chef Sneakers**: +25% permanent walking speed.
- **Vintage Kopitiam Marble Tables**: +25% starting customer patience.
- **Turbo Drink Taps**: Fast beverage dispensers.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Vanilla JavaScript (ES Modules), HTML5 Canvas 2D Vector Rendering, Web Audio API procedural sound synthesizer (zero external audio/image dependencies for instant loads).
- **Backend**: Node.js & Express serving static assets, health check, and save game persistence APIs.
- **Deployment**: Docker container on `kopipeng-net` bridge network behind Nginx Reverse Proxy with automated Let's Encrypt SSL at `https://play.kopipeng.online`.
