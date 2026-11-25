import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach} from "vitest";
import Groupes from "./groupes";
import { MemoryRouter } from "react-router";

describe("Composant groupes", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("affiche le formulaire de création si aucun groupe n'est pas actif.", () => {
        render(
            <MemoryRouter>
                <Groupes groupeId={null} />
            </MemoryRouter>,
        );

        expect(screen.getByText("Créer un groupe")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Nom du groupe")).toBeInTheDocument();
    });
})