import {AddMetadataProfiles} from "@ralvarezdev/js-module-permissions";
import {Profile} from "../router/Security/Profile.js";
import {PROFILES_NAME as PROFILES} from "./constants.js";
import {User} from "../router/Security/User.js";
import {Security} from "../router/Security/Security.js";

// Security module

// - Profile object
AddMetadataProfiles(Profile, "CreateProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "UpdateProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "DeleteProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "SearchProfileByName", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "GetAllProfiles", PROFILES.SUPER_ADMIN)

// - Security object
AddMetadataProfiles(Security, "AssignProfilePermission", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security, "RevokeProfilePermission", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security, "GetProfilePermissionsMethods", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security, "GetModules", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security, "GetObjectsByModuleID", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security, "GetMethodsByObjectID", PROFILES.SUPER_ADMIN)

// - User object
AddMetadataProfiles(User, "AssignUserProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(User, "RevokeUserProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(User, "SearchUserByUsername", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(User, "CreateUser", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(User, "GetUserDetailsByUserID", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(User, "GetAllUsers", PROFILES.SUPER_ADMIN)