package br.com.restaurant.backend.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.com.restaurant.backend.entities.Item;
import br.com.restaurant.backend.entities.Pedidos;
import br.com.restaurant.backend.repository.ItemRepository;
import br.com.restaurant.backend.repository.PedidosRepository;

@Service
public class PedidosService {

    @Autowired
    private PedidosRepository pedidosRepository;

    @Autowired
    private ItemRepository itemRepository;

    public List<Pedidos> findAll() {
        return pedidosRepository.findAll();
    }

    public Optional<Pedidos> findById(String id) {
        return pedidosRepository.findById(id);
    }

    public Pedidos createPedido(Pedidos pedido) {
        pedido.setDataPedido(LocalDateTime.now());
        return pedidosRepository.save(pedido);
    }

    public Optional<Pedidos> updatePedido(String id, Pedidos updatedPedido) {
        return pedidosRepository.findById(id).map(pedido -> {
            pedido.setDataPedido(updatedPedido.getDataPedido());
            pedido.setPedidos(updatedPedido.getPedidos());
            return pedidosRepository.save(pedido);
        });
    }

    public boolean deletePedido(String id) {
        return pedidosRepository.findById(id).map(pedido -> {
            pedidosRepository.delete(pedido);
            return true;
        }).orElse(false);
    }

    public Optional<Pedidos> addItemToPedido(String pedidoId, String itemId) {
        return pedidosRepository.findById(pedidoId).flatMap(pedido -> {
            return itemRepository.findById(itemId).map(item -> {
                pedido.getPedidos().add(item);
                return pedidosRepository.save(pedido);
            });
        });
    }

    public Optional<Pedidos> removeItemFromPedido(String pedidoId, String itemId) {
        return pedidosRepository.findById(pedidoId).flatMap(pedido -> {
            return itemRepository.findById(itemId).map(item -> {
                pedido.getPedidos().remove(item);
                return pedidosRepository.save(pedido);
            });
        });
    }
}