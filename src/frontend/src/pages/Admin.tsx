import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "@tanstack/react-router";
import { Loader2, Plus, ShieldAlert, Upload } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { ExternalBlob, Rarity } from "../backend.d";
import { sampleRabbits } from "../data/sampleData";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateRabbit,
  useGetAllRabbits,
  useIsCallerAdmin,
} from "../hooks/useQueries";

const rarityOptions: { value: Rarity; label: string }[] = [
  { value: Rarity.common, label: "Common" },
  { value: Rarity.rare, label: "Rare" },
  { value: Rarity.unique, label: "Unique" },
];

const rarityColors: Record<Rarity, string> = {
  [Rarity.common]: "bg-muted text-muted-foreground",
  [Rarity.rare]: "bg-secondary text-foreground",
  [Rarity.unique]: "gold-bg text-white",
};

export default function AdminPage() {
  const { identity, loginStatus } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { data: rabbits, isLoading: rabbitsLoading } = useGetAllRabbits();
  const createRabbit = useCreateRabbit();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [form, setForm] = useState({
    name: "",
    series: "",
    year: "",
    character: "",
    description: "",
    collectionNumber: "",
    rarity: Rarity.common as Rarity,
    startingPrice: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.series ||
      !form.collectionNumber ||
      !form.startingPrice
    ) {
      toast.error("Fill in all required fields");
      return;
    }
    try {
      let photo: ExternalBlob | null = null;
      if (imageFile) {
        const bytes = new Uint8Array(await imageFile.arrayBuffer());
        photo = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
          setUploadProgress(pct),
        );
      }
      const id = `PET-${form.series.toUpperCase()}-${form.collectionNumber.padStart(3, "0")}`;
      const materials = [form.character, form.description]
        .filter(Boolean)
        .join("; ");
      await createRabbit.mutateAsync({
        id,
        name: form.name,
        birthDate: BigInt(Date.now()) * BigInt(1_000_000),
        materials,
        rarity: form.rarity,
        coordinates: { x: 0, y: 0 },
        photo,
      });
      toast.success(`Pet ${form.name} added successfully!`);
      setForm({
        name: "",
        series: "",
        year: "",
        character: "",
        description: "",
        collectionNumber: "",
        rarity: Rarity.common,
        startingPrice: "",
      });
      setImageFile(null);
      setImagePreview(null);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      toast.error("Failed to add pet");
      console.error(err);
    }
  };

  if (!isLoggedIn) {
    return (
      <main className="container mx-auto px-6 max-w-7xl py-20 text-center">
        <ShieldAlert className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h1 className="text-2xl font-extrabold text-foreground mb-3">
          Authorization required
        </h1>
        <p className="text-muted-foreground">Sign in as admin</p>
      </main>
    );
  }

  if (adminLoading) {
    return (
      <main className="container mx-auto px-6 max-w-7xl py-20 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
        <p className="text-muted-foreground mt-4">Checking permissions...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="container mx-auto px-6 max-w-7xl py-20 text-center">
        <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
        <h1 className="text-2xl font-extrabold text-foreground mb-3">
          Access denied
        </h1>
        <p className="text-muted-foreground mb-6">
          This page is for admins only
        </p>
        <Link to="/">
          <Button className="rounded-full">Home</Button>
        </Link>
      </main>
    );
  }

  const allPets = rabbits && rabbits.length > 0 ? rabbits : sampleRabbits;

  return (
    <main className="container mx-auto px-6 max-w-7xl py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="w-8 h-8 gold-bg rounded-full flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-white" />
          </span>
          <h1 className="text-3xl font-extrabold text-foreground">
            Admin Panel
          </h1>
        </div>
        <p className="text-muted-foreground mb-10">
          Manage the RichieStory pet collection
        </p>

        <div className="grid lg:grid-cols-2 gap-10">
          {/* Add pet form */}
          <div className="bg-card rounded-3xl border border-border shadow-card p-8">
            <h2 className="text-xl font-extrabold text-foreground mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-primary" /> Add New Pet
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label className="text-sm font-semibold mb-2 block">
                  Pet Photo
                </Label>
                <button
                  type="button"
                  className="w-full border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer hover:border-primary transition-colors mint-light-bg"
                  onClick={() => fileInputRef.current?.click()}
                  data-ocid="admin.dropzone"
                >
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-40 mx-auto rounded-xl object-contain"
                    />
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Click to upload photo
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        PNG, JPG up to 10 MB
                      </p>
                    </>
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                  data-ocid="admin.upload_button"
                />
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {uploadProgress}%
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold mb-1.5 block"
                  >
                    Name *
                  </Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    placeholder="Snowball"
                    className="rounded-xl"
                    required
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="series"
                    className="text-sm font-semibold mb-1.5 block"
                  >
                    Series *
                  </Label>
                  <Input
                    id="series"
                    value={form.series}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, series: e.target.value }))
                    }
                    placeholder="WINTER"
                    className="rounded-xl"
                    required
                    data-ocid="admin.input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="year"
                    className="text-sm font-semibold mb-1.5 block"
                  >
                    Release Year
                  </Label>
                  <Input
                    id="year"
                    value={form.year}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, year: e.target.value }))
                    }
                    placeholder="2025"
                    className="rounded-xl"
                    data-ocid="admin.input"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="collectionNumber"
                    className="text-sm font-semibold mb-1.5 block"
                  >
                    Collection # *
                  </Label>
                  <Input
                    id="collectionNumber"
                    value={form.collectionNumber}
                    onChange={(e) =>
                      setForm((p) => ({
                        ...p,
                        collectionNumber: e.target.value,
                      }))
                    }
                    placeholder="001"
                    className="rounded-xl"
                    required
                    data-ocid="admin.input"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="character"
                  className="text-sm font-semibold mb-1.5 block"
                >
                  Personality
                </Label>
                <Input
                  id="character"
                  value={form.character}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, character: e.target.value }))
                  }
                  placeholder="Friendly, playful, curious"
                  className="rounded-xl"
                  data-ocid="admin.input"
                />
              </div>

              <div>
                <Label
                  htmlFor="description"
                  className="text-sm font-semibold mb-1.5 block"
                >
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="The unique story of this pet..."
                  className="rounded-xl resize-none"
                  rows={3}
                  data-ocid="admin.textarea"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold mb-1.5 block">
                    Rarity
                  </Label>
                  <Select
                    value={form.rarity}
                    onValueChange={(v) =>
                      setForm((p) => ({ ...p, rarity: v as Rarity }))
                    }
                  >
                    <SelectTrigger
                      className="rounded-xl"
                      data-ocid="admin.select"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rarityOptions.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="startingPrice"
                    className="text-sm font-semibold mb-1.5 block"
                  >
                    Starting price (credits) *
                  </Label>
                  <Input
                    id="startingPrice"
                    type="number"
                    value={form.startingPrice}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, startingPrice: e.target.value }))
                    }
                    placeholder="1000"
                    className="rounded-xl"
                    required
                    data-ocid="admin.input"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full rounded-full font-bold bg-primary text-primary-foreground h-12"
                disabled={createRabbit.isPending}
                data-ocid="admin.submit_button"
              >
                {createRabbit.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" /> Add Pet
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Pets list */}
          <div>
            <h2 className="text-xl font-extrabold text-foreground mb-6">
              All Platform Pets
            </h2>
            {rabbitsLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-20 w-full rounded-2xl" />
                ))}
              </div>
            ) : (
              <div
                className="space-y-3 max-h-[600px] overflow-y-auto pr-1"
                data-ocid="admin.list"
              >
                {allPets.map((r, i) => {
                  const rarity =
                    typeof r.rarity === "string"
                      ? (r.rarity as Rarity)
                      : Rarity.common;
                  return (
                    <motion.div
                      key={"id" in r ? r.id : (r as any).id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-card rounded-2xl border border-border shadow-xs p-4 flex items-center gap-4"
                      data-ocid={`admin.item.${i + 1}`}
                    >
                      <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 mint-light-bg flex items-center justify-center">
                        {"image" in r && (r as any).image ? (
                          <img
                            src={(r as any).image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-xl">🐾</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-muted-foreground">
                            {"id" in r ? r.id : ""}
                          </span>
                          <Badge className={`text-xs ${rarityColors[rarity]}`}>
                            {rarity === Rarity.unique
                              ? "★ Unique"
                              : rarity === Rarity.rare
                                ? "Rare"
                                : "Common"}
                          </Badge>
                        </div>
                        <p className="font-bold text-sm text-foreground truncate">
                          {"name" in r ? r.name : ""}
                        </p>
                      </div>
                      <Link
                        to="/pet/$id"
                        params={{ id: ("id" in r ? r.id : "") as string }}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-full text-xs"
                        >
                          View
                        </Button>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
