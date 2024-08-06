import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

interface TrafficLightSettings {
	visible: boolean;
	tabHeaderShift: boolean;
}

const DEFAULT_SETTINGS: TrafficLightSettings = {
	visible: true,
	tabHeaderShift: false,
};

export default class TrafficControl extends Plugin {
	settings: TrafficLightSettings;

	tabHeader: HTMLElement | null = document.querySelector(
		".workspace-tabs.mod-top-left-space .workspace-tab-header-container",
	);

	hideTrafficLights = async () => {
		window
			.require("electron")
			.remote.getCurrentWindow()
			.setWindowButtonVisibility(false);
		this.settings.visible = false;
		this.settings.tabHeaderShift = true;
		if (this.tabHeader !== null) {
			this.tabHeader.classList.add("traffic-control");
		}
		await this.saveSettings();
	};

	showTrafficLights = async () => {
		window
			.require("electron")
			.remote.getCurrentWindow()
			.setWindowButtonVisibility(true);
		this.settings.visible = true;
		this.settings.tabHeaderShift = false;
		if (this.tabHeader !== null) {
			this.tabHeader.classList.remove("traffic-control");
		}
		await this.saveSettings();
	};

	async onload() {
		await this.loadSettings();

		if (!this.settings.visible && this.tabHeader !== null) {
			await this.hideTrafficLights();
		}

		this.addCommand({
			id: "show-traffic-lights",
			name: "Show",
			checkCallback: (checking: boolean) => {
				if (!this.settings.visible) {
					if (!checking) {
						this.showTrafficLights();
						this.saveSettings();
					}
					return true;
				}
				return false;
			},
		});

		this.addCommand({
			id: "hide-traffic-lights",
			name: "Hide",
			checkCallback: (checking: boolean) => {
				if (this.settings.visible) {
					if (!checking) {
						this.hideTrafficLights();
						this.saveSettings();
					}
					return true;
				}
				return false;
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new TrafficLightSettingTab(this.app, this));
	}

	async onunload() {
		if (this.settings.visible && this.tabHeader !== null) {
			this.showTrafficLights();
			await this.saveSettings();
		}
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class TrafficLightSettingTab extends PluginSettingTab {
	plugin: TrafficControl;

	constructor(app: App, plugin: TrafficControl) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("🚥 Traffic Control")
			.setDesc("Show/Hide Native macOS Window Controls")
			.addToggle((toggle) =>
				toggle
					.setValue(this.plugin.settings.visible)
					.onChange(async (value) => {
						if (value) {
							this.plugin.showTrafficLights();
						} else {
							this.plugin.hideTrafficLights();
						}
						await this.plugin.saveSettings();
					}),
			);
	}
}
