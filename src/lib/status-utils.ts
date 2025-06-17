// Draft status mappings
export const DRAFT_STATUS_DISPLAY = {
  draft: {
    label: "Draft",
    description: "Cause is being created",
    variant: "secondary" as const,
  },
  incomplete: {
    label: "Setup Required",
    description: "Complete Stripe setup to continue",
    variant: "warning" as const,
  },
  pending: {
    label: "Processing",
    description: "Setting up your cause",
    variant: "default" as const,
  },
  complete: {
    label: "Complete",
    description: "Cause created successfully",
    variant: "success" as const,
  },
  error: {
    label: "Error",
    description: "Something went wrong",
    variant: "destructive" as const,
  },
  not_found: {
    label: "Not Found",
    description: "Draft not found",
    variant: "destructive" as const,
  },
} as const;

// Cause status mappings
export const CAUSE_STATUS_DISPLAY = {
  Pending: {
    label: "Setting Up",
    description: "Your cause is being set up",
    variant: "warning" as const,
    showToCreator: true,
    showToPublic: false,
  },
  StripeCreated: {
    label: "Payment Setup",
    description: "Configuring payment processing",
    variant: "warning" as const,
    showToCreator: true,
    showToPublic: false,
  },
  TokenMinted: {
    label: "Finalizing",
    description: "Creating your token",
    variant: "default" as const,
    showToCreator: true,
    showToPublic: false,
  },
  Active: {
    label: "Active",
    description: "Ready to receive donations",
    variant: "success" as const,
    showToCreator: true,
    showToPublic: true,
  },
  Failed: {
    label: "Setup Failed",
    description: "Please contact support",
    variant: "destructive" as const,
    showToCreator: true,
    showToPublic: false,
  },
} as const;

export type DraftStatus = keyof typeof DRAFT_STATUS_DISPLAY;
export type CauseStatus = keyof typeof CAUSE_STATUS_DISPLAY;

export function getDraftStatusDisplay(status: string) {
  return DRAFT_STATUS_DISPLAY[status as DraftStatus] || {
    label: status,
    description: "",
    variant: "secondary" as const,
  };
}

export function getCauseStatusDisplay(status: string) {
  return CAUSE_STATUS_DISPLAY[status as CauseStatus] || {
    label: status,
    description: "",
    variant: "secondary" as const,
    showToCreator: true,
    showToPublic: false,
  };
}

// Helper to determine if cause should be shown based on status
export function shouldShowCause(status: string, isCreator: boolean = false) {
  const statusDisplay = getCauseStatusDisplay(status);
  return isCreator ? statusDisplay.showToCreator : statusDisplay.showToPublic;
}

// Helper to determine if donations should be enabled
export function isDonationEnabled(status: string, isActive: boolean) {
  return status === "active" && isActive;
}