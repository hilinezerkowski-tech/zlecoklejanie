-- =============================================
-- Import 10 studiów z listy rekrutacyjnej
-- Uruchom w Supabase SQL Editor
-- Status: 'pending' — zmień na 'verified' po kontakcie
-- =============================================

INSERT INTO studios (name, city, address, phone, email, instagram, website, rating, review_count, status, notes) VALUES

('Wrap Collabo', 'Kraków', 'ul. Saska 12', '500731621', 'info@wrapcollabo.com', '@wrap_collabo', 'https://wrapcollabo.com', 4.9, 218, 'pending', 'Priorytet A. Zmiana koloru, PPF, design graficzny, przyciemnianie szyb. 2982 followersów na IG.'),

('HotPoint PPF & Detailing', 'Kraków', 'ul. Golikówka 54', '607267268', 'hotpoint.detailing@gmail.com', '@hotpoint.detailing', 'https://hpdetailing.pl', 5.0, 83, 'pending', 'Priorytet A. Właściciel Rafał Prokocki. Specjalizacja PPF (XPEL UltraFit), powłoki ceramiczne/grafenowe/elastomerowe. Pakiety od 1900 zł.'),

('Elite Car Design', 'Wrocław', NULL, '664233599', NULL, NULL, NULL, 4.9, 98, 'pending', 'Priorytet A. Sprawdzić Instagram przed kontaktem.'),

('Studio One', 'Wrocław', NULL, '514931301', NULL, NULL, NULL, 5.0, 67, 'pending', 'Priorytet A. Sprawdzić Instagram przed kontaktem.'),

('Visual Modification', 'Wrocław', NULL, '531927438', NULL, NULL, NULL, 4.9, 35, 'pending', 'Priorytet A. Sprawdzić Instagram przed kontaktem.'),

('WeWrap', 'Poznań', 'ul. Ludmiły 79', '605837599', 'kontakt@wewrap.pl', NULL, 'https://wewrap.pl', 5.0, 95, 'pending', 'Priorytet A. Oklejanie reklamowe, zmiana koloru, przyciemnianie szyb, druk wielkoformatowy. Mają własne studio graficzne.'),

('Premium Wraps', 'Poznań', NULL, '690630099', NULL, NULL, NULL, 4.7, 109, 'pending', 'Priorytet A. Sprawdzić Instagram przed kontaktem.'),

('Wrapcar', 'Gdańsk / Borkowo', NULL, '796705738', NULL, NULL, NULL, 5.0, 101, 'pending', 'Priorytet A. Sprawdzić Instagram przed kontaktem.'),

('Wrap Port', 'Gdańsk', NULL, '784747280', NULL, NULL, NULL, 5.0, 40, 'pending', 'Priorytet A. Sprawdzić Instagram przed kontaktem.'),

('Maxmedia', 'Gdańsk', NULL, '793066555', NULL, NULL, NULL, 5.0, 46, 'pending', 'Priorytet A. Sprawdzić Instagram przed kontaktem.');
