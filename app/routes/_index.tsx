import { json } from "@remix-run/node";

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { useTranslation } from "react-i18next";
import i18nServer, { localeCookie } from "../../i18next.server";
import { I18N_COOKIE_NAME } from "../../constants";

export async function action({ request }: ActionFunctionArgs) {
  // set nextLanguage into cookie
  const body = await request.formData();
  const nextLanguage = body.get(I18N_COOKIE_NAME);

  return json(
    {},
    {
      headers: {
        "Set-Cookie": await localeCookie.serialize(nextLanguage),
      },
    }
  );
}

export async function loader({ request }: LoaderFunctionArgs) {
  const t = await i18nServer.getFixedT(request);
  return json({ description: t("description") });
}

export default function Index() {
  const { t } = useTranslation();
  const { description } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col h-screen items-center justify-center">
      <h1>{t("greeting")}</h1>
      <div>
        <p>{description}</p>
      </div>

      <div className="mt-8">
        <Form
          action="/?index"
          method="POST"
          navigate={false}
          className="flex gap-4 "
        >
          <button type="submit" name={I18N_COOKIE_NAME} value="es">
            Español
          </button>
          <button type="submit" name={I18N_COOKIE_NAME} value="en">
            English
          </button>
          <button type="submit" name={I18N_COOKIE_NAME} value="zh">
            Traditional Chinese
          </button>
        </Form>
      </div>
    </div>
  );
}
