import {AddMetadataProfiles} from "@ralvarezdev/js-module-permissions";
import {Profile} from "../router/Security/Profile.js";
import {PROFILES} from "./security.js";

// Security module

// - Profile object
AddMetadataProfiles(Profile, "AssignProfilePermissions", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "RevokeProfilePermissions", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "CreateProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "UpdateProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "DeleteProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "GetProfilePermissionsMethods", PROFILES.SUPER_ADMIN)

// - User object
AddMetadataProfiles(Profile, "AssignUserProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "RevokeUserProfile", PROFILES.SUPER_ADMIN)