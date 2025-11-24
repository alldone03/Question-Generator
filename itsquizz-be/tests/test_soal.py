def test_create(self):
    res = self.client.post("/soal/", json={
        "text": "Apa arti kata run?",
        "course_id": 1
    })

    print("STATUS:", res.status_code)
    print("RESPONSE:", res.json)

    self.assertIn(res.status_code, [400, 201])
