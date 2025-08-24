package br.com.restaurant.backend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.restaurant.backend.entities.Pedidos;
import br.com.restaurant.backend.services.PedidosService;

@RestController
@CrossOrigin(origins = {
    "http://localhost:5173",
})
@RequestMapping("/api/pedidos")
public class PedidosController {

    @Autowired
    private PedidosService pedidosService;

    @GetMapping
    public ResponseEntity<List<Pedidos>> getAllPedidos() {
        return ResponseEntity.ok(pedidosService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Pedidos> getPedidoById(@PathVariable String id) {
        Optional<Pedidos> pedido = pedidosService.findById(id);
        return pedido.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Pedidos> createPedido(@RequestBody Pedidos pedido) {
        return ResponseEntity.ok(pedidosService.createPedido(pedido));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Pedidos> updatePedido(@PathVariable String id, @RequestBody Pedidos pedido) {
        Optional<Pedidos> updatedPedido = pedidosService.updatePedido(id, pedido);
        return updatedPedido.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePedido(@PathVariable String id) {
        boolean deleted = pedidosService.deletePedido(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

    @PostMapping("/{pedidoId}/items/{itemId}")
    public ResponseEntity<Pedidos> addItemToPedido(@PathVariable String pedidoId, @PathVariable String itemId) {
        Optional<Pedidos> pedido = pedidosService.addItemToPedido(pedidoId, itemId);
        return pedido.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{pedidoId}/items/{itemId}")
    public ResponseEntity<Pedidos> removeItemFromPedido(@PathVariable String pedidoId, @PathVariable String itemId) {
        Optional<Pedidos> pedido = pedidosService.removeItemFromPedido(pedidoId, itemId);
        return pedido.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
}