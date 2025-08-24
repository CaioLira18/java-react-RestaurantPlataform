package br.com.restaurant.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.restaurant.backend.entities.Pedidos;

public interface PedidosRepository extends JpaRepository<Pedidos, String> {
    
}
