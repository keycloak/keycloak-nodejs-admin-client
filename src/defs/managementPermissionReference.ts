export interface ManagementPermissionReference {
    enabled: boolean;
    ressource: string;
    scopePermissions: Record<string, string>;
}