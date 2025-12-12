-- Insert properties
INSERT INTO "Property" (id, title, price, description, "imageUrl", status, "createdAt", "updatedAt") VALUES
(gen_random_uuid(), 'Casa Duna', 500000.0, 'Casa moderna con 3 habitaciones y 2 baños', 'https://via.placeholder.com/300', 'AVAILABLE', NOW(), NOW()),
(gen_random_uuid(), 'Loft Urbano', 300000.0, 'Loft en el centro con 2 habitaciones y 1 baño', 'https://via.placeholder.com/300', 'AVAILABLE', NOW(), NOW());

-- Insert amenities
INSERT INTO "Amenity" (id, name) VALUES
(gen_random_uuid(), 'WiFi'),
(gen_random_uuid(), 'Parking'),
(gen_random_uuid(), 'Pool');