import {AddMetadataProfiles} from "@ralvarezdev/js-module-permissions";
import {Profile} from "../router/Security/Profile.js";
import {ALL_PROFILES_NAME, PROFILES_NAME as PROFILES} from "./constants.js";
import {User} from "../router/Security/User.js";
import {Security} from "../router/Security/Security.js";
import {Publisher} from "../router/Library/Publisher.js";
import {Location} from "../router/Library/Location.js";
import {Topic as LibraryTopic} from "../router/Library/Topic.js";
import {Topic as DocumentTopic} from "../router/Library/Document/Topic.js";
import {Language as OtherLanguage} from "../router/Other/Language.js";
import {
    Language as DocumentLanguage
} from "../router/Library/Document/Language.js";
import {Country} from "../router/Other/Country.js";
import {Author} from "../router/Library/Document/Author.js";
import {LocationSection} from "../router/Library/LocationSection.js";

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

// Library module

// - Location object
AddMetadataProfiles(Location, "CreateLocation", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Location, "UpdateLocation", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Location, "DeleteLocation", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Location, "GetAllLocations", ...ALL_PROFILES_NAME)

// - Location section object
AddMetadataProfiles(LocationSection,
    "CreateLocationSection",
    PROFILES.SUPER_ADMIN
)
AddMetadataProfiles(LocationSection,
    "UpdateLocationSection",
    PROFILES.SUPER_ADMIN
)
AddMetadataProfiles(LocationSection,
    "DeleteLocationSection",
    PROFILES.SUPER_ADMIN
)
AddMetadataProfiles(LocationSection,
    "GetAllLocationSections",
    ...ALL_PROFILES_NAME
)

// - Publisher object
AddMetadataProfiles(Publisher, "CreatePublisher", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Publisher, "UpdatePublisher", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Publisher, "DeletePublisher", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Publisher, "GetAllPublishers", ...ALL_PROFILES_NAME)
AddMetadataProfiles(Publisher, "SearchPublisherByName", ...ALL_PROFILES_NAME)

// - Topic object
AddMetadataProfiles(LibraryTopic,
    "CreateTopic",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)
AddMetadataProfiles(LibraryTopic,
    "UpdateTopic",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)
AddMetadataProfiles(LibraryTopic, "DeleteTopic", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(LibraryTopic, "GetAllTopics", ...ALL_PROFILES_NAME)
AddMetadataProfiles(LibraryTopic, "SearchTopicByName", ...ALL_PROFILES_NAME)

// - Document module

// -- Topic object
AddMetadataProfiles(DocumentTopic,
    "AssignDocumentTopic",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)
AddMetadataProfiles(DocumentTopic,
    "RemoveDocumentTopic",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)
AddMetadataProfiles(DocumentTopic,
    "GetDocumentTopicsByDocumentID",
    ...ALL_PROFILES_NAME
)

// -- Language object
AddMetadataProfiles(DocumentLanguage,
    "AssignDocumentLanguage",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)
AddMetadataProfiles(DocumentLanguage,
    "RemoveDocumentLanguage",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)
AddMetadataProfiles(DocumentLanguage,
    "GetDocumentLanguagesByDocumentID",
    ...ALL_PROFILES_NAME
)

// -- Author object
AddMetadataProfiles(Author,
    "AssignDocumentAuthor",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)
AddMetadataProfiles(Author,
    "RemoveDocumentAuthor",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)
AddMetadataProfiles(Author,
    "GetDocumentAuthorsByDocumentID",
    ...ALL_PROFILES_NAME
)

// Other module

// - Country object
AddMetadataProfiles(Country, "GetAllCountries", ...ALL_PROFILES_NAME)
AddMetadataProfiles(Country, "SearchCountryByName", ...ALL_PROFILES_NAME)

// - Language object
AddMetadataProfiles(OtherLanguage, "GetAllLanguages", ...ALL_PROFILES_NAME)
AddMetadataProfiles(OtherLanguage, "SearchLanguageByName", ...ALL_PROFILES_NAME)
