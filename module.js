Hooks.once("item-piles-ready", async () => {

	const pf2eData = {

		"VERSION": "1.0.10",

		// The actor class type is the type of actor that will be used for the default item pile actor that is created on first item drop.
		"ACTOR_CLASS_TYPE": "loot",

		// The item class type is the type of item that will be used for the default loot item
		"ITEM_CLASS_LOOT_TYPE": "equipment",

		// The item class type is the type of item that will be used for the default weapon item
		"ITEM_CLASS_WEAPON_TYPE": "",

		// The item class type is the type of item that will be used for the default equipment item
		"ITEM_CLASS_EQUIPMENT_TYPE": "",

		// The item quantity attribute is the path to the attribute on items that denote how many of that item that exists
		"ITEM_QUANTITY_ATTRIBUTE": "system.quantity",

		// The item price attribute is the path to the attribute on each item that determine how much it costs
		"ITEM_PRICE_ATTRIBUTE": "system.price",

		// The quantity for price attribute is the path to the attribute on each item that determine how many you get for its price
		"QUANTITY_FOR_PRICE_ATTRIBUTE": "system.price.per",

		// Item types and the filters actively remove items from the item pile inventory UI that users cannot loot, such as spells, feats, and classes
		"ITEM_FILTERS": [{
			"path": "type",
			"filters": 'action,ancestry,background,class,condition,deity,effect,feat,heritage,lore,melee,spell,spellcastingEntry'
		}],

		// Item similarities determines how item piles detect similarities and differences in the system
		"ITEM_SIMILARITIES": ["name", "type", "system.temporary.value"],

		// This function is an optional system handler that specifically transforms an item when it is added to actors, eg turns it into a spell scroll if it was a spell
		"ITEM_TRANSFORMER": async (itemData) => {
			return itemData;
		},

		// This function is an optional system handler that specifically transforms an item's price into a more unified numeric format
		"ITEM_COST_TRANSFORMER": (item) => {
			const itemCost = foundry.utils.getProperty(item, "system.price");
			const { copperValue } = new game.pf2e.Coins(itemCost?.value ?? {});
			return copperValue / 100;
		},

		"PREVIEW_ITEM_TRANSFORMER": (item) => {
			if (game.user.isGM || item?.identificationStatus !== "unidentified") return item;
			return false;
		},

		"PILE_DEFAULTS": {
			merchantColumns: [{
				"label": "Rarity",
				"path": "system.traits.rarity",
				"formatting": "{#}",
				"buying": true,
				"selling": true,
				"mapping": {
					"common": "PF2E.TraitCommon",
					"uncommon": "PF2E.TraitUncommon",
					"rare": "PF2E.TraitRare",
					"unique": "PF2E.TraitUnique"
				}
			}, {
				"label": "Bulk",
				"path": "system.bulk.value",
				"formatting": "{#}",
				"buying": true,
				"selling": true,
				"mapping": { "0": "" }
			}]
		},

		"TOKEN_FLAG_DEFAULTS": {
			flags: {
				pf2e: {
					linkToActorSize: false,
					autoscale: false
				}
			}
		},

		// Currencies in item piles is a versatile system that can accept actor attributes (a number field on the actor's sheet) or items (actual items in their inventory)
		// In the case of attributes, the path is relative to the "actor.system"
		// In the case of items, it is recommended you export the item with `.toObject()`, put it into `data.item`, and strip out any module data
		"CURRENCIES": [{
			type: "item",
			name: "Platinum Pieces",
			img: "systems/pf2e/icons/equipment/treasure/currency/platinum-pieces.webp",
			abbreviation: "{#}PP",
			data: {
				uuid: "Compendium.pf2e.equipment-srd.JuNPeK5Qm1w6wpb4"
			},
			primary: false,
			exchangeRate: 10
		}, {
			type: "item",
			name: "Gold Pieces",
			img: "systems/pf2e/icons/equipment/treasure/currency/gold-pieces.webp",
			abbreviation: "{#}GP",
			data: {
				uuid: "Compendium.pf2e.equipment-srd.B6B7tBWJSqOBz5zz"
			},
			primary: true,
			exchangeRate: 1
		}, {
			type: "item",
			name: "Silver Pieces",
			img: "systems/pf2e/icons/equipment/treasure/currency/silver-pieces.webp",
			abbreviation: "{#}SP",
			data: {
				uuid: "Compendium.pf2e.equipment-srd.5Ew82vBF9YfaiY9f"
			},
			primary: false,
			exchangeRate: 0.1
		}, {
			type: "item",
			name: "Copper Pieces",
			img: "systems/pf2e/icons/equipment/treasure/currency/copper-pieces.webp",
			abbreviation: "{#}CP",
			data: {
				uuid: "Compendium.pf2e.equipment-srd.lzJ8AVhRcbFul5fh"
			},
			primary: false,
			exchangeRate: 0.01
		}],

		"VAULT_STYLES": [],

		"SYSTEM_HOOKS": () => {}
	}

	const sf2eData = {
		...pf2eData,
		// This function is an optional system handler that specifically transforms an item's price into a more unified numeric format
		"ITEM_COST_TRANSFORMER": (item) => {
			const itemCost = foundry.utils.getProperty(item, "system.price");
			const { copperValue } = new game.pf2e.Coins(itemCost?.value ?? {});
			return copperValue / 10;
		},

		// Currencies in item piles is a versatile system that can accept actor attributes (a number field on the actor's sheet) or items (actual items in their inventory)
		// In the case of attributes, the path is relative to the "actor.system"
		// In the case of items, it is recommended you export the item with `.toObject()`, put it into `data.item`, and strip out any module data
		"CURRENCIES": [{
			type: "item",
			name: "Credits",
			img: "icons/sundries/gaming/playing-cards-grey.webp",
			abbreviation: "{#}cr",
			data: {
				item: {
					"_id": "penfpVFkOqZYpmkU",
					"img": "icons/sundries/gaming/playing-cards-grey.webp",
					"name": "Credstick",
					"system": {
						"slug": "credstick",
						"baseItem": null,
						"bulk": {
							"value": 0
						},
						"category": "credstick",
						"containerId": null,
						"description": {
							"value": "<p>Most people in Starfinder keep their wealth on a protected item known as a credstick. These devices are often flat and roughly the size of a human finger. They range in dimensions and quality, but at the end of the day, they're just a means of conveniently carrying and spending money. Usage of these devices is determined by the owner, and a credstick can accept or spend funds with as simple an action as tapping it near a suitable banking device. When more rigorous security is necessary, they can require audio or biometric imprints in order to activate. Some advanced credsticks even have a magical component that might require a mental password or the recitation of a specific spell to access stored funds.</p>\n<p>Credsticks aren't gateways to the entirety of one's wealth, and larger stores of credits are often kept secured in banks, personal vaults, or secure databases. Instead, a credstick is a safe and anonymous means of moving credits around without being traced. Adventurers and common citizens alike often keep a credstick on their person to handle any purchases they might be called upon to make, while also only keeping just enough credits on them that losing the credstick wouldn't result in bankruptcy.</p>\n<p>Individuals in the Pact Worlds often carry credsticks, and other civilizations that interact with the Pact often turn local funds into credits and thus carry them to spend their converted currency. Sometimes a person might carry several credsticks, dedicating each one to a different use, or simply trading the stick away if they want to make a purchase of a predefined amount. If ever the number of credsticks on a person becomes too cumbersome, it's easy enough to move the funds between individual sticks and discard emptied sticks to save on space, however a credstick always has a negligible bulk.</p>"
						},
						"hardness": 0,
						"hp": {
							"max": 0,
							"value": 0
						},
						"level": {
							"value": 0
						},
						"material": {
							"grade": null,
							"type": null
						},
						"price": {
							"per": 1,
							"value": {
								"sp": 1
							}
						},
						"publication": {
							"license": "ORC",
							"remaster": true,
							"title": "Starfinder Player Core"
						},
						"quantity": 1,
						"rules": [],
						"size": "med",
						"temporary": false,
						"traits": {
							"rarity": "common",
							"value": []
						}
					},
					"type": "treasure"
				}
			},
			primary: true,
			exchangeRate: 1
		},
		{
			type: "item",
			name: "UPB",
			img: "systems/pf2e/icons/equipment/treasure/currency/upb.webp",
			abbreviation: "{#}upb",
			data: {
				item: {
					"_id": "ALqTYbYspMMrJIDs",
					"img": "systems/pf2e/icons/equipment/treasure/currency/upb.webp",
					"name": "UPB",
					"system": {
						"slug": "upb",
						"baseItem": null,
						"bulk": {
							"value": 1
						},
						"category": "material",
						"containerId": null,
						"description": {
							"value": "<p>A universal polymer base, or UPB, is a tiny multifunction component, not much larger than a grain of rice. Used in the crafting of most common galactic goods, UPBs can be configured to act as a brace, capacitor, circuit, diode, fastener, insulator, lens, modulator, pipe, resistor, and dozens of other constituent parts. UPBs can even be spun out into fabric, broken down into component chemicals, reconstituted into new chemicals, or supplemented with base materials (such as dirt or sand) to form massive braces or walls. The right combination of hundreds or even thousands of UPBs can create everything from a comm unit to a laser weapon to powered armor. In their raw form, UPBs have a bulk of 1 per 1,000 UPBs.</p>\n<p>UPBs are so common that they're used as currency in many major settlements and trade hubs. While credsticks are a more convenient and secure way to carry value, UPBs have the advantage of direct utility and untraceability.</p>\n<p>Characters can use UPBs in place of credits for crafting items using maker's kits; in fact, they're necessary for the use of certain tools.</p>"
						},
						"hardness": 0,
						"hp": {
							"max": 0,
							"value": 0
						},
						"level": {
							"value": 0
						},
						"material": {
							"grade": null,
							"type": null
						},
						"price": {
							"per": 1,
							"value": {
								"sp": 1
							}
						},
						"publication": {
							"license": "ORC",
							"remaster": true,
							"title": "Starfinder Player Core"
						},
						"quantity": 1,
						"rules": [],
						"size": "med",
						"temporary": false,
						"traits": {
							"rarity": "common",
							"value": []
						}
					},
					"type": "treasure"
				}
			},
			primary: false,
			exchangeRate: 1
		}],
		"CURRENCY_DECIMAL_DIGITS": 1
	}

	if (game.system.id === 'pf2e') {
		await game.itempiles.API.addSystemIntegration(pf2eData);
	}
	else if (game.system.id === 'sf2e') {
		await game.itempiles.API.addSystemIntegration(sf2eData);
	}
});
