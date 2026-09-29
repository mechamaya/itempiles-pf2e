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

		"VERSION": "1.1.1",

		// Credsticks and UPBs are handled as attribute currencies, so we need to hide the underlying items from the pile inventory
		"ITEM_FILTERS": [
			...pf2eData.ITEM_FILTERS,
			{ "path": "system.category", "filters": "credstick" },
			{ "path": "system.slug", "filters": "upb" }
		],

		// This function is an optional system handler that specifically transforms an item's price into a more unified numeric format
		"ITEM_COST_TRANSFORMER": (item) => {
			const itemCost = foundry.utils.getProperty(item, "system.price");
			const { copperValue } = new game.pf2e.Coins(itemCost?.value ?? {});
			return copperValue / 10;
		},

		// SF2e stores credits as the price of credstick items and UPBs as treasure items, so both are exposed as attributes that
		// read from the actor's inventory getter. Writes to these paths are intercepted by patchSf2eCurrencyUpdates below.
		"CURRENCIES": [
			{
				type: "attribute",
				name: "Credits",
				img: "icons/sundries/gaming/playing-cards-grey.webp",
				abbreviation: "{#}cr",
				data: {
					path: "inventory.currency.credits",
				},
				primary: true,
				exchangeRate: 1
			},
			{
				type: "attribute",
				name: "UPBs",
				img: "systems/sf2e/icons/equipment/treasure/currency/upb.webp",
				abbreviation: "{#}upb",
				data: {
					path: "inventory.currency.upb",
				},
				primary: false,
				exchangeRate: 1
			}
		],
		"CURRENCY_DECIMAL_DIGITS": 1
	}

	if (game.system.id === 'pf2e') {
		await game.itempiles.API.addSystemIntegration(pf2eData);
	}
	else if (game.system.id === 'sf2e') {
		patchSf2eCurrencyUpdates();
		registerSf2eCurrencyRefresh();
		await game.itempiles.API.addSystemIntegration(sf2eData);
	}
});

// Item Piles writes attribute currencies with actor.update({ [path]: newTotal }). These paths are not part of the actor schema,
// so the data doesn't get committed to the actor. So instead we will pull them out before the update and apply it through the
// SF2e inventory API instead.
const SF2E_CURRENCY_PATHS = {
	"inventory.currency.credits": "credits",
	"inventory.currency.upb": "upb"
};

function patchSf2eCurrencyUpdates() {
	const ActorClass = CONFIG.Actor.documentClass;
	const originalUpdate = ActorClass.prototype.update;

	ActorClass.prototype.update = async function (data = {}, operation = {}) {
		if (!this.inventory || foundry.utils.getType(data) !== "Object") {
			return originalUpdate.call(this, data, operation);
		}

		const additions = {};
		const removals = {};
		let remaining = data;
		for (const [path, denomination] of Object.entries(SF2E_CURRENCY_PATHS)) {
			const newValue = path in data ? data[path] : foundry.utils.getProperty(data, path);
			if (newValue === undefined) continue;

			if (remaining === data) remaining = foundry.utils.deepClone(data);
			delete remaining[path];
			if (remaining.inventory?.currency) delete remaining.inventory.currency[denomination];

			const delta = Math.max(0, Math.floor(Number(newValue) || 0)) - this.inventory.currency[denomination];
			if (delta > 0) additions[denomination] = delta;
			else if (delta < 0) removals[denomination] = -delta;
		}

		if (remaining === data) return originalUpdate.call(this, data, operation);

		if (!foundry.utils.isEmpty(removals)) await this.inventory.removeCurrency(removals, { byValue: false });
		if (!foundry.utils.isEmpty(additions)) await this.inventory.addCurrency(additions);

		if (remaining.inventory?.currency && foundry.utils.isEmpty(remaining.inventory.currency)) delete remaining.inventory.currency;
		if (remaining.inventory && foundry.utils.isEmpty(remaining.inventory)) delete remaining.inventory;
		if (foundry.utils.isEmpty(remaining)) return this;
		return originalUpdate.call(this, remaining, operation);
	};
}

// Item Piles refreshes attribute currencies when an actor update contains their path, but SF2e currency changes only touch
// currency items. So we need to refresh the currency totals when these items change.
function registerSf2eCurrencyRefresh() {
	const pendingRefreshes = new Map();

	const refreshCurrencies = (item) => {
		const actor = item.parent;
		if (!(actor instanceof Actor) || item.type !== "treasure") return;
		if (item.system.category !== "credstick" && item.system.slug !== "upb") return;

		// A single currency change can create, update and delete several items, so only refresh once per actor
		if (pendingRefreshes.has(actor.uuid)) return;
		pendingRefreshes.set(actor.uuid, setTimeout(() => {
			pendingRefreshes.delete(actor.uuid);
			const data = {};
			for (const [path, denomination] of Object.entries(SF2E_CURRENCY_PATHS)) {
				foundry.utils.setProperty(data, path, actor.inventory?.currency[denomination] ?? 0);
			}
			actor.render(false, { action: "update", data });
		}));
	};

	Hooks.on("createItem", refreshCurrencies);
	Hooks.on("updateItem", refreshCurrencies);
	Hooks.on("deleteItem", refreshCurrencies);
}
