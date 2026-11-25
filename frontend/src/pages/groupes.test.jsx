import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach} from "vitest";
import Groupes from "./groupes";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";

describe("Composant groupes", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        globalThis.fetch = vi.fn();
    });

    // Affichage de la création de groupe
    // Arrange
    it("affiche le formulaire de création si aucun groupe n'est pas actif.", () => {
        
        // Act
        render(
            <MemoryRouter>
                <Groupes groupeId={null} />
            </MemoryRouter>,
        );

        // Assert
        expect(screen.getByText("Créer un groupe")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Nom du groupe")).toBeInTheDocument();
        expect(screen.getByText("Créer")).toBeInTheDocument();
    });

    it("insertion d'un nom de groupe", () => {
        render(
            <MemoryRouter>
                <Groupes groupeId={null} />
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText("Nom du groupe");
        fireEvent.change(input, { target: {value: "Mon Groupe"}});

        expect(input.value).toBe("Mon Groupe");
    });

    it("affiche la liste apès avoir saisi un nom et l'appui sur le bouton", async () => {
       fetch
        .mockResolvedValueOnce({
            ok: true,
            text: () => JSON.stringify({ id: 1, name: "Mon Groupe"}),
        })
        .mockResolvedValueOnce({
            ok: true,
            text: () => JSON.stringify({ members: [] }),
        })
       
        render(
            <MemoryRouter>
                <Groupes groupeId={null}/>
            </MemoryRouter>
        );

        const input = screen.getByPlaceholderText("Nom du groupe");
        const bouton = screen.getByText("Créer");

        fireEvent.change(input, { target: {value: "Mon Groupe"}});
        fireEvent.click(bouton);

        expect(await screen.findByText("Membres")).toBeInTheDocument();
    });
})