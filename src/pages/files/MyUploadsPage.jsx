// src/pages/files/MyUploadsPage.jsx
// Same layout as Browse Files; the server returns only the signed-in user's uploads.
import React from "react";
import FilesPage from "./FilesPage";

export default function MyUploadsPage() {
    return <FilesPage mine />;
}
