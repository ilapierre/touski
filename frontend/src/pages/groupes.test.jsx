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

        // Erreur dans la gestion du groupes d'utilisateur : [UPD]Erreur où le owner ne pouvait pas supprimer.
    });

    // Insertion du nom de groupe
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

    // Affichage de la page liste groupe
    it("affiche la liste apès avoir saisi un nom et l'appui sur le bouton", async () => {
       localStorage.setItem("token", "test-token");

        fetch
        .mockResolvedValueOnce({
            ok: true,
            text: () => JSON.stringify({ id: 1, name: "Mon Groupe"}),
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => [
                { id: 1, email: "test1@test.com", nickname: null, role: "owner"},
            ],
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({ email: "test1@test.com"}),
        })
        .mockResolvedValueOnce({
            ok: true,
            json: async () => ({ name : "Mon Groupe"}),
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
        expect(await screen.findByText("Profile")).toBeInTheDocument();
        expect(await screen.findByText("Supprimer Groupe")).toBeInTheDocument();
        expect(await screen.findByText("Inviter un membre")).toBeInTheDocument();
    });
})