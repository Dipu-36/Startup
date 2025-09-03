// Clerk configuration
const publishableKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

if (!publishableKey) {
  throw new Error("Missing Publishable Key");
}

export const CLERK_PUBLISHABLE_KEY: string = publishableKey;

// Clerk appearance configuration
export const clerkAppearance = {
  variables: {
    colorPrimary: "hsl(var(--primary))",
    colorBackground: "hsl(var(--background))",
    colorInputBackground: "hsl(var(--background))",
    colorInputText: "hsl(var(--foreground))",
    borderRadius: "0.5rem",
  },
  elements: {
    formButtonPrimary: "bg-primary text-primary-foreground hover:bg-primary/90",
    card: "bg-card text-card-foreground shadow-xl border border-border",
    headerTitle: "text-foreground",
    headerSubtitle: "text-muted-foreground",
    socialButtonsBlockButton: "border border-border text-foreground hover:bg-accent",
    formFieldLabel: "text-foreground",
    formFieldInput: "border border-border bg-background text-foreground",
    footerActionLink: "text-primary hover:text-primary/80",
  },
};
