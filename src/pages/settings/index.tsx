import styles from "./SettingsPage.module.scss";
import Head from "next/head";
import { useForm, zodResolver } from "@mantine/form";
import { Textarea, TextInput } from "@mantine/core";
import { z } from "zod";
import { api } from "../../utils/api";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useThemeContext } from "../../components/ThemeManager/ThemeManager";
import { Brightness, Login } from "tabler-icons-react";
import { signOut } from "next-auth/react";

const schema = z.object({
  displayName: z
    .string()
    .min(3)
    .max(32)
    .regex(/^\S+(?: \S+)*$/),
  username: z
    .string()
    .min(3)
    .max(32)
    .regex(/^[a-z0-9._]+$/),
  bio: z.string().max(320),
});

export default function SettingsPage() {
  const form = useForm({
    validate: zodResolver(schema),
    initialValues: {
      displayName: "",
      username: "",
      bio: "",
    },
  });
  const router = useRouter();
  const updateSettingsMutation = api.user.updateSettings.useMutation();
  const { data: settingsData } = api.user.getSettings.useQuery();
  const theme = useThemeContext();

  useEffect(() => {
    if (settingsData) {
      form.setValues({
        bio: settingsData?.bio ?? "",
        displayName: settingsData?.displayName ?? "",
        username: settingsData?.username ?? "",
      });
    }
  }, [settingsData]);

  if (!settingsData) {
    return <></>;
  }

  return (
    <>
      <Head>
        <title>Grumbler | Settings</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.settingsPage}>
        <form
          className={styles.form}
          onSubmit={form.onSubmit(async (values) => {
            await updateSettingsMutation.mutate(values);
            router.reload();
          })}
        >
          <div
            className={`${styles.option} ${styles.desktopOnly}`}
            onClick={() => {
              void (async () => {
                await signOut();
              })();
            }}
          >
            <Login size={32} strokeWidth={2} color={"black"} />
            <span className={styles.optionText}>Sign out</span>
          </div>
          <div onClick={() => theme.toggleTheme()}>
            <Brightness size={32} strokeWidth={2} color={"black"} />
            <span className={styles.optionText}>{theme.theme} mode</span>
          </div>
          <TextInput
            {...form.getInputProps("displayName")}
            label="Display name"
          />
          <TextInput {...form.getInputProps("username")} label="Username" />
          <Textarea {...form.getInputProps("bio")} label="Bio" />
          <button className={styles.submitButton} type="submit">
            Save changes
          </button>
        </form>
      </div>
    </>
  );
}
