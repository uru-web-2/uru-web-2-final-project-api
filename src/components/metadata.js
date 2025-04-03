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
import {
    LocationSection as DocumentLocationSection
} from "../router/Library/Document/LocationSection.js";
import {
    LocationSection as LibraryLocationSection
} from "../router/Library/LocationSection.js";
import {Book} from "../router/Library/Document/Book/Book.js";
import {Magazine} from "../router/Library/Document/Magazine/Magazine.js";
import {
    MagazineIssue
} from "../router/Library/Document/Magazine/MagazineIssue.js";
import {Article} from "../router/Library/Document/Article/Article.js";
import {Thesis} from "../router/Library/Document/Thesis/Thesis.js";

// Security module

// - Profile object
AddMetadataProfiles(Profile, "CreateProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "UpdateProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "RemoveProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "SearchProfileByName", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Profile, "GetAllProfiles", PROFILES.SUPER_ADMIN)

// - Security object
AddMetadataProfiles(Security, "CreateProfilePermission", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security, "RemoveProfilePermission", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security,
    "GetProfilePermissionsMethods",
    PROFILES.SUPER_ADMIN
)
AddMetadataProfiles(Security, "GetModules", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security, "GetObjectsByModuleID", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security, "GetMethodsByObjectID", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security, "CreateUserProfile", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Security, "RemoveUserProfile", PROFILES.SUPER_ADMIN)
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
AddMetadataProfiles(Location, "RemoveLocation", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Location, "GetAllLocations", ...ALL_PROFILES_NAME)

// - Location section object
AddMetadataProfiles(LibraryLocationSection,
    "CreateLocationSection",
    PROFILES.SUPER_ADMIN
)
AddMetadataProfiles(LibraryLocationSection,
    "UpdateLocationSection",
    PROFILES.SUPER_ADMIN
)
AddMetadataProfiles(LibraryLocationSection,
    "RemoveLocationSection",
    PROFILES.SUPER_ADMIN
)
AddMetadataProfiles(LibraryLocationSection,
    "GetAllLocationSections",
    ...ALL_PROFILES_NAME
)
AddMetadataProfiles(LibraryLocationSection,
    "GetLocationSectionsByLocationID",
    ...ALL_PROFILES_NAME,
)

// - Publisher object
AddMetadataProfiles(Publisher, "CreatePublisher", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Publisher, "UpdatePublisher", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(Publisher, "RemovePublisher", PROFILES.SUPER_ADMIN)
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
AddMetadataProfiles(LibraryTopic, "RemoveTopic", PROFILES.SUPER_ADMIN)
AddMetadataProfiles(LibraryTopic, "GetAllTopics", ...ALL_PROFILES_NAME)
AddMetadataProfiles(LibraryTopic, "SearchTopicByName", ...ALL_PROFILES_NAME)

// - Document module

// -- Topic object
AddMetadataProfiles(DocumentTopic,
    "CreateDocumentTopic",
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
    "CreateDocumentLanguage",
    PROFILES.SUPER_ADMIN,
    PROFILES.STUDENT,
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

// -- Location section object
AddMetadataProfiles(DocumentLocationSection,
    "CreateDocumentLocationSection",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)
AddMetadataProfiles(DocumentLocationSection,
    "RemoveDocumentLocationSection",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)
AddMetadataProfiles(DocumentLocationSection,
    "GetDocumentLocationSectionsByDocumentID",
    ...ALL_PROFILES_NAME
)

// -- Article module

// --- Article object

AddMetadataProfiles(Article,
    "CreateArticle",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)

// -- Book module

// --- Book object

AddMetadataProfiles(Book,
    "CreateBook",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)

// -- Magazine module

// --- Magazine object

AddMetadataProfiles(Magazine,
    "CreateMagazine",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)
AddMetadataProfiles(Magazine,
    "UpdateMagazine",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)
AddMetadataProfiles(Magazine,
    "RemoveMagazine",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)
AddMetadataProfiles(Magazine, "GetAllMagazines", ...ALL_PROFILES_NAME)
AddMetadataProfiles(Magazine, "SearchMagazineByName", ...ALL_PROFILES_NAME)
AddMetadataProfiles(MagazineIssue,
    "CreateMagazineIssue",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)

// -- Thesis module

// --- Thesis object

AddMetadataProfiles(Thesis,
    "CreateThesis",
    PROFILES.SUPER_ADMIN,
    PROFILES.LIBRARIAN
)

// Other module

// - Country object
AddMetadataProfiles(Country, "GetAllCountries", ...ALL_PROFILES_NAME)
AddMetadataProfiles(Country, "SearchCountryByName", ...ALL_PROFILES_NAME)

// - Language object
AddMetadataProfiles(OtherLanguage, "GetAllLanguages", ...ALL_PROFILES_NAME)
AddMetadataProfiles(OtherLanguage, "SearchLanguageByName", ...ALL_PROFILES_NAME)
