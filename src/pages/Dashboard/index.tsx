import React, { useEffect, useState } from "react";

import { Header } from "../../components/Header";
import { Food } from "../../components/Food";
import { ModalAddFood } from "../../components/ModalAddFood";
import { ModalEditFood } from "../../components/ModalEditFood";

import { api } from "../../services/api";
import { IFoodData } from "../../types";

import { FoodsContainer } from "./styles";
export function Dashboard() {
  const [foods, setFoods] = useState<IFoodData[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodData>({} as IFoodData);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  /**
   * Função para adicionar um novo prato
   * @param food
   */
  async function handleAddFood(
    food: Omit<IFoodData, "id" | "available">
  ): Promise<void> {
    try {
      const response = await api.post("/foods", {
        ...food,
        available: true,
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Função para atualizar um prato
   * @param food
   */
  async function handleUpdateFood(
    food: Omit<IFoodData, "id" | "available">
  ): Promise<void> {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...editingFood,
        ...food,
      });

      const foodsUpdated = foods.map((f) =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * Função para remover um prato
   * @param id: number
   */
  async function handleDeleteFood(id: number): Promise<void> {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter((food) => food.id !== id);

    setFoods(foodsFiltered);
  }

  /**
   * Função para disparar o modal de edição
   * do prato
   * @param food
   */
  function handleEditFood(food: IFoodData): void {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  function toggleModal() {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  }

  useEffect(() => {
    async function getFoods(): Promise<void> {
      const response = await api.get("/foods");
      setFoods(response.data);
    }

    getFoods();
  }, []);

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map((food) => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}
