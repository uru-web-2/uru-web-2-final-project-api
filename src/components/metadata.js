import {AddMetadataProfiles} from "@ralvarezdev/js-module-permissions";
import {Book} from "../router/Library/Book.js";
import {Thesis} from "../router/Library/Thesis.js";
import {PROFILES} from "./security.js";

// Set the profiles permissions for each method on the controller
AddMetadataProfiles(Book, "Create", PROFILES.LIBRARIAN);
AddMetadataProfiles(Thesis, "Create", PROFILES.LIBRARIAN);
