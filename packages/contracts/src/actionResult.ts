export type ActionError = {
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type ActionSuccess = {
  message?: string;
};

export type ActionResult<TData = undefined> =
  | {
      ok: true;
      data?: TData;
      message?: string;
    }
  | {
      ok: false;
      error: string;
      fieldErrors?: Record<string, string[]>;
    };
