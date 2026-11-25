import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach} from "vitest";
import Groupes from "./groupes";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router";

describe("Composant groupes", () => {
    beforeEach(() => {
        localStorage.clear();
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

        const bouton = screen.getByText("Créer");
        fireEvent.click(bouton);

        // Assert
        expect(screen.getByText("Créer un groupe")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Nom du groupe")).toBeInTheDocument();
        expect(bouton).toBeTruthy();
    });

})