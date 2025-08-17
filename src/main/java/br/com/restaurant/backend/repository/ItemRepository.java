package br.com.restaurant.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.restaurant.backend.entities.Item;


public interface ItemRepository extends JpaRepository<Item, String> {
    
}