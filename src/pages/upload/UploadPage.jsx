// src/pages/upload/UploadPage.jsx
// Share a Google Drive PDF. Saves the same fields as before (category = student |
// professional | others, subcategory = free text), so existing sheet data keeps working.
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BriefcaseIcon, CheckCircle2Icon, EyeIcon, GlobeIcon, GraduationCapIcon, RotateCcwIcon, SendIcon } from "lucide-react";
import Input from "../../components/Input/Input";
import Button from "../../components/Button/Button";
import FileCard from "../../components/cards/FileCard";
import FilePreviewModal from "../../components/preview/FilePreviewModal";
import AudiencePicker from "../../components/upload/AudiencePicker";
import TopicPicker from "../../components/upload/TopicPicker";
import { saveFileMetadata, fetchTaxonomy, fetchFiles } from "../../services/filesService";
import { classifyDriveLink } from "../../utils/drive";
import { useToast } from "../../hooks/useToast";
import { UI_CONFIG, interpolate } from "../../config/ui.config";
import { cn } from "@/lib/utils";

const U = UI_CONFIG.UPLOAD;
const DRAFT_KEY = "uploadDraft";
const TITLE_MAX = 100;
const DESCRIPTION_MAX = 300;
const ROLES = ["student", "professional", "others"];

const AUDIENCES = [
    { value: "student", icon: GraduationCapIcon, ...U.AUDIENCE.student },
    { value: "professional", icon: BriefcaseIcon, ...U.AUDIENCE.professional },
    { value: "others", icon: GlobeIcon, ...U.AUDIENCE.others },
];

function readAuth() {
    try {
        const stored = JSON.parse(sessionStorage.getItem("auth") || "null");
        return stored?.ok ? stored : {};
    } catch {
        return {};
    }
}

/** Default audience = the role chosen at signup, so most people never need to change it. */
function emptyForm(auth) {
    return {
        driveUrl: "",
        title: "",
        description: "",
        category: ROLES.includes(auth.userType) ? auth.userType : "student",
        subcategory: "",
    };
}

function readDraft(auth) {
    try {
        const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null");
        if (draft && typeof draft === "object") return { ...emptyForm(auth), ...draft };
    } catch {
        // ignore a broken draft
    }
    return emptyForm(auth);
}

function Section({ step, title, children }) {
    return (
        <section className="rounded-md border border-border bg-background p-5 sm:p-6">
            <h2 className="m-0 mb-4 flex items-center gap-3 text-base font-bold text-foreground">
                <span className="grid size-7 place-items-center rounded-md bg-foreground font-display text-xs font-extrabold text-background">
                    {step}
                </span>
                {title}
            </h2>
            {children}
        </section>
    );
}

export default function UploadPage() {
    const navigate = useNavigate();
    const toast = useToast();
    const auth = readAuth();

    const [form, setForm] = useState(() => readDraft(auth));
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);
    const [taxonomy, setTaxonomy] = useState({});
    const [previewOpen, setPreviewOpen] = useState(false);
    const [existingFileIds, setExistingFileIds] = useState(new Set());

    // Keep a draft so a refresh or accidental navigation doesn't lose what was typed
    useEffect(() => {
        try {
            sessionStorage.setItem(DRAFT_KEY, JSON.stringify(form));
        } catch {
            // storage unavailable: the form still works without a draft
        }
    }, [form]);

    // Topics + existing fileIds (for real-time duplicate detection)
    useEffect(() => {
        let cancelled = false;
        fetchTaxonomy().then((res) => {
            if (!cancelled && res.ok) setTaxonomy(res.categories || {});
        });
        fetchFiles({ limit: 0 }).then((res) => {
            if (!cancelled && res.ok && Array.isArray(res.rows)) {
                setExistingFileIds(new Set(res.rows.map((r) => r.fileid).filter(Boolean)));
            }
        });
        return () => { cancelled = true; };
    }, []);

    const link = classifyDriveLink(form.driveUrl);

    const set = (key) => (valueOrEvent) => {
        const value = valueOrEvent?.target ? valueOrEvent.target.value : valueOrEvent;
        setForm((f) => ({ ...f, [key]: value }));
        if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
    };

    const isDuplicateLink = link.status === "ok" && existingFileIds.has(link.fileId);
    const linkError = errors.driveUrl
        || (isDuplicateLink ? U.DUPLICATE_FILE : "")
        || (link.status === "folder" ? U.LINK_FOLDER : link.status === "invalid" ? U.LINK_INVALID : "");

    const validate = () => {
        const next = {};
        if (link.status !== "ok") next.driveUrl = link.status === "folder" ? U.LINK_FOLDER : U.LINK_INVALID;
        else if (isDuplicateLink) next.driveUrl = U.DUPLICATE_FILE;
        if (!form.title.trim()) next.title = U.TITLE_REQUIRED;
        else if (form.title.trim().length < 3) next.title = U.TITLE_TOO_SHORT;
        if (!form.subcategory.trim()) next.subcategory = U.TOPIC_REQUIRED;
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            toast.error(U.FIX_ERRORS);
            return;
        }

        setSaving(true);
        const res = await saveFileMetadata({
            username: auth.username || "",
            email: auth.email || "",
            category: form.category,
            subcategory: form.subcategory.trim(),
            title: form.title.trim(),
            description: form.description.trim(),
            driveUrl: form.driveUrl.trim(),
            fileId: link.fileId,
            thumbnailUrl: "",
        });
        setSaving(false);

        if (!res.ok) {
            if (res.duplicate) {
                const field = res.duplicateType === 'title' ? 'title' : 'driveUrl';
                setErrors((e) => ({ ...e, [field]: res.msg || U.DUPLICATE_FILE }));
                toast.error(U.DUPLICATE_TOAST);
            } else {
                toast.error(res.msg || U.ERROR_UPLOAD_FAILED);
            }
            return;
        }
        try {
            sessionStorage.removeItem(DRAFT_KEY);
        } catch {
            // nothing to clean up
        }
        toast.success(U.SUCCESS);
        navigate("/my-uploads");
    };

    const clearForm = () => {
        setForm(emptyForm(auth));
        setErrors({});
    };

    const cardItem = {
        title: form.title.trim() || U.CARD_PREVIEW_TITLE,
        description: form.description.trim(),
        category: form.category,
        subcategory: form.subcategory.trim(),
        username: auth.username || "",
        fileid: link.fileId,
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <div className="mb-6">
                <h1 className="m-0 font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{U.PAGE_TITLE}</h1>
                <p className="m-0 mt-1 text-sm text-muted-foreground">{U.PAGE_SUBTITLE}</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="grid gap-5">
                    {/* 1. Link */}
                    <Section step="1" title={U.STEP_LINK}>
                        <div className="grid gap-3">
                            <Input
                                name="driveUrl"
                                type="url"
                                label={U.LINK_LABEL}
                                placeholder={U.DRIVE_LINK_PLACEHOLDER}
                                value={form.driveUrl}
                                onChange={set("driveUrl")}
                                error={linkError}
                                helpText={link.status === "ok" ? U.LINK_OK : U.LINK_HELP}
                                disabled={saving}
                                required
                            />

                            {link.status === "ok" && (
                                <div className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-muted px-3 py-2 animate-in fade-in-0 slide-in-from-top-1">
                                    <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
                                        <CheckCircle2Icon className="size-4" aria-hidden="true" />
                                        {U.LINK_OK}
                                    </span>
                                    <Button variant="secondary" size="sm" icon={EyeIcon} onClick={() => setPreviewOpen(true)}>
                                        {U.PREVIEW_FILE}
                                    </Button>
                                </div>
                            )}

                            <details className="group text-sm">
                                <summary className="cursor-pointer list-none font-semibold text-muted-foreground transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                                    {U.LINK_HOWTO}
                                </summary>
                                <ol className="mt-2 mb-0 grid gap-1 pl-5 text-muted-foreground">
                                    {U.LINK_STEPS.map((s) => (
                                        <li key={s}>{s}</li>
                                    ))}
                                </ol>
                            </details>
                        </div>
                    </Section>

                    {/* 2. Details */}
                    <Section step="2" title={U.STEP_DETAILS}>
                        <div className="grid gap-4">
                            <Input
                                name="title"
                                label={U.TITLE_LABEL}
                                placeholder={U.TITLE_PLACEHOLDER}
                                value={form.title}
                                onChange={set("title")}
                                maxLength={TITLE_MAX}
                                error={errors.title}
                                helpText={`${form.title.length}/${TITLE_MAX}`}
                                disabled={saving}
                                required
                            />
                            <div className="grid gap-1.5">
                                <label htmlFor="upload-description" className="mb-0 text-sm font-semibold text-foreground">
                                    {U.DESCRIPTION_LABEL}
                                </label>
                                <textarea
                                    id="upload-description"
                                    rows={3}
                                    maxLength={DESCRIPTION_MAX}
                                    value={form.description}
                                    onChange={set("description")}
                                    placeholder={U.DESCRIPTION_PLACEHOLDER}
                                    disabled={saving}
                                    className="min-h-24 w-full resize-y rounded-md border border-solid border-input bg-background px-3 py-2 text-[15px] text-foreground outline-none transition-[border-color,box-shadow] duration-200 placeholder:text-muted-foreground focus:border-foreground focus:ring-1 focus:ring-foreground/20"
                                />
                                <p className="m-0 text-right text-xs text-muted-foreground">
                                    {form.description.length}/{DESCRIPTION_MAX}
                                </p>
                            </div>
                        </div>
                    </Section>

                    {/* 3. Audience + topic */}
                    <Section step="3" title={U.STEP_AUDIENCE}>
                        <div className="grid gap-5">
                            <AudiencePicker
                                name="category"
                                ariaLabel={U.STEP_AUDIENCE}
                                value={form.category}
                                onChange={set("category")}
                                options={AUDIENCES}
                            />
                            <TopicPicker
                                value={form.subcategory}
                                onChange={set("subcategory")}
                                popular={taxonomy[form.category] || []}
                                defaults={U.TOPIC_DEFAULTS[form.category] || []}
                                label={U.TOPIC_LABEL}
                                placeholder={U.TOPIC_PLACEHOLDER}
                                help={U.TOPIC_HELP}
                                newTopicText={(topic) => interpolate(U.TOPIC_NEW, { topic })}
                                error={errors.subcategory}
                            />
                        </div>
                    </Section>
                </div>

                {/* Live preview + submit (sticky on desktop) */}
                <aside className="grid gap-4 lg:sticky lg:top-6">
                    <div>
                        <p className="m-0 mb-2 text-xs font-bold tracking-wider text-muted-foreground uppercase">{U.CARD_PREVIEW}</p>
                        <div className={cn("transition-opacity duration-300", form.title.trim() ? "opacity-100" : "opacity-70")}>
                            <FileCard item={cardItem} onOpen={() => link.status === "ok" && setPreviewOpen(true)} />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5">
                        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-foreground text-[11px] font-extrabold text-background">
                            {(auth.username || "?").trim().split(/\s+/).map((p) => p[0]).slice(0, 2).join("").toUpperCase()}
                        </span>
                        <span className="min-w-0">
                            <span className="block text-[11px] font-bold tracking-wider text-muted-foreground uppercase">{U.POSTING_AS}</span>
                            <span className="block truncate text-sm font-semibold text-foreground">{auth.username}</span>
                        </span>
                    </div>

                    <Button type="submit" variant="primary" size="lg" fullWidth icon={SendIcon} loading={saving} disabled={saving}>
                        {saving ? U.SUBMITTING : U.SUBMIT}
                    </Button>
                    <Button variant="ghost" size="sm" fullWidth icon={RotateCcwIcon} onClick={clearForm} disabled={saving}>
                        {U.CLEAR_FORM}
                    </Button>
                </aside>
            </form>

            {previewOpen && link.status === "ok" && (
                <FilePreviewModal
                    key={link.fileId}
                    fileId={link.fileId}
                    title={form.title.trim() || U.PREVIEW_FILE}
                    onClose={() => setPreviewOpen(false)}
                />
            )}
        </div>
    );
}
