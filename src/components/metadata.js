import {AddMetadataProfiles} from "@ralvarezdev/js-module-permissions";
import {Profile} from "../router/Security/Profile.js";
import {ALL_PROFILES_NAME, PROFILES_NAME as PROFILES} from "./constants.js";
import {User} from "../router/Security/User.js";
import {Security} from "../router/Security/Security.js";
import {Publisher} from "../router/Document/Publisher.js";

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
AddMetadataProfiles(Security,
    "GetProfilePermissionsMethods",
    PROFILES.SUPER_ADMIN
)
AddMetadataProfiles(Security, "GetModules", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security, "GetObjectsByModuleID", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security, "GetMethodsByObjectID", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security, "AssignUserProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security, "RevokeUserProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security, "SetProfilePermissions", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security,
    "GetMethodsByProfileIDObjectID",
    PROFILES.SUPER_ADMIN
)

// - User object
AddMetadataProfiles(User, "SearchUserByUsername", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(User, "CreateUser", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(User, "GetUserDetailsByUserID", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(User, "GetAllUsers", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(User, "UpdateUserByAdmin", PROFILES.SUPER_ADMIN)

// Document module

// - Publisher object
AddMetadataProfiles(Publisher, "CreatePublisher", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Publisher, "UpdatePublisher", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Publisher, "DeletePublisher", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Publisher, "GetAllPublishers", ...ALL_PROFILES_NAME)
AddMetadataProfiles(Publisher, "SearchPublisherByName", ...ALL_PROFILES_NAME)

// - Topic object
AddMetadataProfiles(Publisher, "CreateTopic", PROFILES.SUPER_ADMIN, PROFILES.LIBRARIAN)
AddMetadataProfiles(Publisher, "UpdateTopic", PROFILES.SUPER_ADMIN, PROFILES.LIBRARIAN)
AddMetadataProfiles(Publisher, "DeleteTopic", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Publisher, "GetAllTopics", ...ALL_PROFILES_NAME)
AddMetadataProfiles(Publisher, "SearchTopicByName", ...ALL_PROFILES_NAME)
AddMetadataProfiles(Publisher, "AssignDocumentTopic", PROFILES.SUPER_ADMIN, PROFILES.LIBRARIAN)
AddMetadataProfiles(Publisher, "RemoveDocumentTopic", PROFILES.SUPER_ADMIN, PROFILES.LIBRARIAN)

// Other module

// - Country object
AddMetadataProfiles(Publisher, "GetAllCountries", ...ALL_PROFILES_NAME)
AddMetadataProfiles(Publisher, "SearchCountryByName", ...ALL_PROFILES_NAME)

// - Language object
AddMetadataProfiles(Publisher, "GetAllLanguages", ...ALL_PROFILES_NAME)
AddMetadataProfiles(Publisher, "SearchLanguageByName", ...ALL_PROFILES_NAME)