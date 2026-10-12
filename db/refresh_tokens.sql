CREATE TABLE IF NOT EXISTS public.refresh_tokens (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    manager_id INTEGER REFERENCES public.managers(id) ON DELETE CASCADE,
    customer_id BIGINT REFERENCES public.customers(id) ON DELETE CASCADE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CHECK ((manager_id IS NOT NULL AND customer_id IS NULL)
        OR (manager_id IS NULL AND customer_id IS NOT NULL))
);
