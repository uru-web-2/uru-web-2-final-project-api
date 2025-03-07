import {AddMetadataProfiles} from "@ralvarezdev/js-module-permissions";
import {Profile} from "../router/Security/Profile.js";
import {PROFILES_NAME as PROFILES} from "./constants.js";
import {User} from "../router/Security/User.js";

// Security module

// - Profile object
AddMetadataProfiles(Profile, "AssignProfilePermission", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "RevokeProfilePermission", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "CreateProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "UpdateProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "DeleteProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "GetProfilePermissionsMethods", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "SearchProfileByName", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "GetAllProfiles", PROFILES.SUPER_ADMIN)

// - User object
AddMetadataProfiles(User, "AssignUserProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(User, "RevokeUserProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(User, "SearchUserByUsername", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(User, "CreateUser", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(User, "GetUserDetailsByUserID", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(User, "GetAllUsers", PROFILES.SUPER_ADMIN)