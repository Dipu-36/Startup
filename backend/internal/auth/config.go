package auth

// AppConfig holds all application configuration
type AppConfig struct {
	Name         string
	DisplayName  string
	DatabaseName string
	APIMessage   string
}

// APP_CONFIG - Change app name here and it will reflect everywhere
var APP_CONFIG = AppConfig{
	Name:         "SponsorConnect",
	DisplayName:  "SponsorConnect",
	DatabaseName: "sponsorconnect",
	APIMessage:   "SponsorConnect API is running",
}

// Convenience functions for getting config values
func GetAppName() string {
	return APP_CONFIG.Name
}

func GetDisplayName() string {
	return APP_CONFIG.DisplayName
}

func GetDatabaseName() string {
	return APP_CONFIG.DatabaseName
}

func GetAPIMessage() string {
	return APP_CONFIG.APIMessage
}
