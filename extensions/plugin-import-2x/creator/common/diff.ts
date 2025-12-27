export const UUID_2D_TO_3D: Map<string, string> = new Map<string, string>();
export const UUID_UI_2D_TO_3D: Map<string, string> = new Map<string, string>();
export const UUID_SKIP_EFFECT: Map<string, string> = new Map<string, string>();

export function initDiff() {
    // builtin-standard.effect -> builtin-phong.effect
    UUID_2D_TO_3D.set('abc2cb62-7852-4525-a90d-d474487b88f2', '1baf0fc9-befa-459c-8bdd-af1a450a0319');
    // builtin-2d-graphics -> builtin-graphics
    UUID_2D_TO_3D.set('30682f87-9f0d-4f17-8a44-72863791461b', '1c02ae6f-4492-4915-b8f8-7492a3b1e4cd');
    // builtin-2d-spine -> builtin-spine
    UUID_2D_TO_3D.set('0e93aeaa-0b53-4e40-b8e0-6268b4e07bd7', '7383da24-dfde-48e8-82a7-a6e8a56f285c');
    // builtin-2d-sprite -> builtin-sprite
    UUID_2D_TO_3D.set('2874f8dd-416c-4440-81b7-555975426e93', '60f7195c-ec2a-45eb-ba94-8955f60e81d0');
    // builtin-3d-particle -> builtin-particle
    UUID_2D_TO_3D.set('829a282c-b049-4019-bd38-5ace8d8a6417', 'd1346436-ac96-4271-b863-1f4fdead95b0');
    // builtin-3d-trail -> builtin-particle-trail
    UUID_2D_TO_3D.set('2a7c0036-e0b3-4fe1-8998-89a54b8a2bec', '17debcc3-0a6b-4b8a-b00b-dc58b885581e');
    // builtin-clear-stencil
    UUID_2D_TO_3D.set('cf7e0bb8-a81c-44a9-ad79-d28d43991032', '810e96e4-e456-4468-9b59-f4e8f39732c0');
    // builtin-unlit
    UUID_2D_TO_3D.set('6d91e591-4ce0-465c-809f-610ec95019c6', 'a3cd009f-0ab0-420d-9278-b9fdab939bbc');
    // builtin-toon
    UUID_2D_TO_3D.set('e2f00085-c597-422d-9759-52c360279106', 'a7612b54-35e3-4238-a1a9-4a7b54635839');
    // builtin-2d-sprite -> ui-sprite-material
    UUID_2D_TO_3D.set('eca5d2f2-8ef6-41c2-bbe6-f9c79d09c432', 'fda095cb-831d-4601-ad94-846013963de8');
    // builtin-2d-label -> ui-sprite-material
    UUID_2D_TO_3D.set('e02d87d4-e599-4d16-8001-e14891ac6506', 'fda095cb-831d-4601-ad94-846013963de8');
    // builtin-2d-gray-sprite -> ui-sprite-material
    UUID_2D_TO_3D.set('3a7bb79f-32fd-422e-ada2-96f518fed422', 'fda095cb-831d-4601-ad94-846013963de8');

    // primitives
    UUID_2D_TO_3D.set('954fec8b-cd16-4bb9-a3b7-7719660e7558', '1263d74c-8167-4928-91a6-4e2672411f47');
    // box.mesh
    UUID_2D_TO_3D.set('046f172c-1574-488b-bbb8-6415a9adb96d', '1263d74c-8167-4928-91a6-4e2672411f47@a804a');
    // capsule.mesh
    UUID_2D_TO_3D.set('83f5eff8-3385-4f95-9b76-8da0aa1d96cd', '1263d74c-8167-4928-91a6-4e2672411f47@801ec');
    // cone.mesh
    UUID_2D_TO_3D.set('7a17de6e-227a-46b1-8009-e7157d4d3acf', '1263d74c-8167-4928-91a6-4e2672411f47@38fd2');
    // cylinder.mesh
    UUID_2D_TO_3D.set('b430cea3-6ab3-4106-b073-26c698918edd', '1263d74c-8167-4928-91a6-4e2672411f47@8abdc');
    // DefaultMaterial
    UUID_2D_TO_3D.set('a5849239-3ad3-41d1-8ab4-ae9fea11f97f', '1263d74c-8167-4928-91a6-4e2672411f47@ea6e2');
    // plane.mesh
    UUID_2D_TO_3D.set('a1ef2fc9-9c57-418a-8f69-6bed9a7a0e7f', '1263d74c-8167-4928-91a6-4e2672411f47@2e76e');
    // primitives.prefab
    UUID_2D_TO_3D.set('ab2fdde9-10c2-44e4-bfe1-fcfcc1a86aa9', '1263d74c-8167-4928-91a6-4e2672411f47@aae0f');
    // quad.mesh
    UUID_2D_TO_3D.set('e93d3fa9-8c21-4375-8a21-14ba84066c77', '1263d74c-8167-4928-91a6-4e2672411f47@fc873');
    // sphere.mesh
    UUID_2D_TO_3D.set('3bbdb0f6-c5f6-45de-9f33-8b5cbafb4d6d', '1263d74c-8167-4928-91a6-4e2672411f47@17020');
    // torus.mesh
    UUID_2D_TO_3D.set('14c74869-bdb4-4f57-86d8-a7875de2be30', '1263d74c-8167-4928-91a6-4e2672411f47@40ece');


    // box -> cube
    UUID_2D_TO_3D.set('a87cc147-01b2-43f8-8e42-a7ca90b0c757', '30da77a1-f02d-4ede-aa56-403452ee7fde');
    // capsule
    UUID_2D_TO_3D.set('fe1417b6-fe6b-46a4-ae7c-9fd331f33a2a', '73ce1f7f-d1f4-4942-ad93-66ca3b3041ab');
    // cone
    UUID_2D_TO_3D.set('b5fc2cf2-7942-483d-be1f-bbeadc4714ad', '6350d660-e888-4acf-a552-f3b719ae9110');
    // Cylinder
    UUID_2D_TO_3D.set('1c5e4038-953a-44c2-b620-0bbfc6170477', 'ab3e16f9-671e-48a7-90b7-d0884d9cbb85');
    // Plane
    UUID_2D_TO_3D.set('3f376125-a699-40ca-ad05-04d662eaa1f2', '40563723-f8fc-4216-99ea-a81636435c10');
    // Quad
    UUID_2D_TO_3D.set('6c9ef10d-b479-420b-bfe6-39cdda6a8ae0', '34a07346-9f62-4a84-90ae-cb83f7a426c1');
    // Sphere
    UUID_2D_TO_3D.set('2d9a4b85-b0ab-4c46-84c5-18f393ab2058', '655c9519-1a37-472b-bae6-29fefac0b550');
    // Torus
    UUID_2D_TO_3D.set('de510076-056b-484f-b94c-83bef217d0e1', 'd47f5d5e-c931-4ff4-987b-cc818a728b82');
    //
    UUID_SKIP_EFFECT.set('abc2cb62-7852-4525-a90d-d474487b88f2', 'builtin-phong.effect');
    // 内置 UI 替换
    // default-particle.png
    UUID_UI_2D_TO_3D.set('600301aa-3357-4a10-b086-84f011fa32ba', 'b5b27ab1-e740-4398-b407-848fc2b2c897');
    // default_btn_disabled.png
    UUID_UI_2D_TO_3D.set('71561142-4c83-4933-afca-cb7a17f67053', '951249e0-9f16-456d-8b85-a6ca954da16b');
    // default_btn_normal.png
    UUID_UI_2D_TO_3D.set('e851e89b-faa2-4484-bea6-5c01dd9f06e2', '20835ba4-6145-4fbc-a58a-051ce700aa3e');
    // default_btn_pressed.png
    UUID_UI_2D_TO_3D.set('b43ff3c2-02bb-4874-81f7-f2dea6970f18', '544e49d6-3f05-4fa8-9a9e-091f98fc2ce8');
    // default_editbox_bg.png
    UUID_UI_2D_TO_3D.set('edd215b9-2796-4a05-aaf5-81f96c9281ce', 'bd1bcaba-bd7d-4a71-b143-997c882383e4');
    // default_panel.png
    UUID_UI_2D_TO_3D.set('d81ec8ad-247c-4e62-aa3c-d35c4193c7af', 'b730527c-3233-41c2-aaf7-7cdab58f9749');
    // default_progressbar.png
    UUID_UI_2D_TO_3D.set('cfef78f1-c8df-49b7-8ed0-4c953ace2621', '24a704da-2867-446d-8d1a-5e920c75e09d');
    // default_progressbar_bg.png
    UUID_UI_2D_TO_3D.set('99170b0b-d210-46f1-b213-7d9e3f23098a', '9fd900dd-221b-4f89-8f2c-fba34243c835');
    // default_radio_button_off.png
    UUID_UI_2D_TO_3D.set('567dcd80-8bf4-4535-8a5a-313f1caf078a', 'f12a23c4-b924-4322-a260-3d982428f1e8');
    // default_radio_button_on.png
    UUID_UI_2D_TO_3D.set('9d60001f-b5f4-4726-a629-2659e3ded0b8', '45828f25-b50d-4c52-a591-e19491a62b8c');
    // default_scrollbar.png
    UUID_UI_2D_TO_3D.set('0291c134-b3da-4098-b7b5-e397edbe947f', '0da256a2-21f6-481b-90b6-d3643a09179b');
    // default_scrollbar_bg.png
    UUID_UI_2D_TO_3D.set('4bab67cb-18e6-4099-b840-355f0473f890', '28765e2f-040a-4c65-8e8c-f9d0bb79d863');
    // default_scrollbar_vertical.png
    UUID_UI_2D_TO_3D.set('d6d3ca85-4681-47c1-b5dd-d036a9d39ea2', 'afc47931-f066-46b0-90be-9fe61f213428');
    // default_scrollbar_vertical_bg.png
    UUID_UI_2D_TO_3D.set('617323dd-11f4-4dd3-8eec-0caf6b3b45b9', 'ffb88a8f-af62-48f4-8f1d-3cb606443a43');
    // default_sprite.png
    UUID_UI_2D_TO_3D.set('6e056173-d285-473c-b206-40a7fff5386e', '57520716-48c8-4a19-8acf-41c9f8777fb0');
    // default_sprite_splash.png
    UUID_UI_2D_TO_3D.set('0275e94c-56a7-410f-bd1a-fc7483f7d14a', '7d8f9b89-4fd1-4c9f-a3ab-38ec7cded7ca');
    // default_toggle_checkmark.png
    UUID_UI_2D_TO_3D.set('73a0903d-d80e-4e3c-aa67-f999543c08f5', '158e7e52-3220-4cd7-9694-713e0e6e8278');
    // default_toggle_disabled.png
    UUID_UI_2D_TO_3D.set('c25b9d50-c8fc-4d27-beeb-6e7c1f2e5c0f', 'ca7e121b-293c-4763-829a-b7a5fa81f0d2');
    // default_toggle_normal.png
    UUID_UI_2D_TO_3D.set('d29077ba-1627-4a72-9579-7b56a235340c', '11bdc4b0-64a8-4eb7-a2a7-9fb9e233e977');
    // default_toggle_pressed.png
    UUID_UI_2D_TO_3D.set('b181c1e4-0a72-4a91-bfb0-ae6f36ca60bd', 'a04e994f-ee49-47b6-9d08-2f59e3773fcc');
    // atom
    UUID_UI_2D_TO_3D.set('b8223619-7e38-47c4-841f-9160c232495a', '86f25d5c-9de5-454f-a5f9-ee16603e6701');
    UUID_UI_2D_TO_3D.set('b2687ac4-099e-403c-a192-ff477686f4f5', '86f25d5c-9de5-454f-a5f9-ee16603e6701');
    // atom.png texture
    UUID_UI_2D_TO_3D.set('8a96b965-2dc0-4e03-aa90-3b79cb93b5b4', '24c419ea-63a8-4ea1-a9d0-7fc469489bbc@6c48a');
    UUID_UI_2D_TO_3D.set('d0a82d39-bede-46c4-b698-c81ff0dedfff', '24c419ea-63a8-4ea1-a9d0-7fc469489bbc@6c48a');
    // atom.png sprite-frame
    UUID_UI_2D_TO_3D.set('bb42ed8e-0867-4584-ad63-b6f84f83bba8', '24c419ea-63a8-4ea1-a9d0-7fc469489bbc@f9941');
    UUID_UI_2D_TO_3D.set('472df5d3-35e7-4184-9e6c-7f41bee65ee3', '24c419ea-63a8-4ea1-a9d0-7fc469489bbc@f9941');
    // 3d 粒子
    UUID_UI_2D_TO_3D.set('432fa09c-cf03-4cff-a186-982604408a07', 'ea7478b0-408d-4052-b703-f0d2355e095f');
    // video
    UUID_UI_2D_TO_3D.set('2be36297-9abb-4fee-8049-9ed5e271da8a', '2be36297-9abb-4fee-8049-9ed5e271da8a');
}
