import names
import random
import json
import copy
from datetime import timedelta
from random_word import RandomWords
from faker import Faker

fake = Faker()
r = RandomWords()

struct = {
    "first_name": "",
    "last_name": "",
    "gt_email": "@gatech.edu",
    "PI_name": "",
    "tray_name": "",
    "printer_name": "",
    "material_type": "",
    "est_material": "",
    "est_time": "",
    "queue_date": "",
    "queue_time": "",
    "events": [
    ],
    "done": False,
    "failed": False
}

events = [
    {
        "type": "print_start",
        "time": "12:00",
        "date": "2023-06-15",
        "comment": ""
    },
    {
        "type": "print_success",
        "time": "12:30",
        "date": "2023-06-15",
        "comment": ""
    },
    {
        "type": "print_fail",
        "time": "12:30",
        "date": "2023-06-15",
        "comment": "Failed to print"
    }
]

PI_names = ['Cheryl Malone', 'Ronald Martin', 'Wade Allgood', 'Phyllis Carlton', 'Jonathon Roos',
            'Forest Mark', 'Dennis Weaver', 'Christine Schuett', 'Robert Meyers', 'Stephen Coble']

printers = {
    "Ultimaker": [
        "Ultimaker 1", "Ultimaker 2", "Ultimaker 3", "Ultimaker 4"
    ],
    "Stratasys": [
        "Left Stratasys", "Center Stratasys", "Right Stratasys"
    ],
    "Formlabs": [
        "CloudyPytilia", "WealthyAcouchi"
    ]
}

materials = {
    "Ultimaker": "PLA",
    "Stratasys": "ABS",
    "Formlabs": "Resin"
}


def main():
    output = []
    for i in range(100):
        # generate a random name
        name = names.get_full_name()

        # split the name into first and last
        first, last = name.split(" ")
        # create a new struct via deepcopy
        new_struct = copy.deepcopy(struct)
        # set the first and last name
        new_struct["first_name"] = first
        new_struct["last_name"] = last
        # set the PI name
        new_struct["PI_name"] = PI_names[random.randrange(0, len(PI_names))]
        # set the email
        new_struct["gt_email"] = first.lower()[0] + "" + \
            last.lower() + str(random.randrange(0, 15)) + "@gatech.edu"
        # set the tray name
        new_struct["tray_name"] = first + "_" + \
            last + "_" + r.get_random_word()

        printer_type = list(printers.keys())[
            random.randrange(0, len(printers.keys()))]
        printer_name = printers[printer_type][random.randrange(
            0, len(printers[printer_type]))]
        new_struct["printer_name"] = printer_name
        new_struct["material_type"] = materials[printer_type]
        new_struct["est_material"] = random.randrange(0, 100)
        new_struct["est_time"] = f"0{random.randrange(0, 8)}:{random.randrange(0, 6)}{random.randrange(0, 9)}"

        datetime = fake.date_time_between(start_date='-3y', end_date='now')
        time = datetime.strftime("%H:%M")
        date = datetime.strftime("%Y-%m-%d")
        new_struct["queue_time"] = time
        new_struct["queue_date"] = date

        new_struct["events"].append({
            "type": "print_queue",
            "time": time,
            "date": date,
            "comment": ""
        })

        future1 = datetime + timedelta(hours=random.randrange(0, 60), minutes=random.randrange(0, 60))
        if random.randrange(0, 100) < 80:
            new_struct["events"].append({
                "type": "print_start",
                "time": future1.strftime("%H:%M"),
                "date": future1.strftime("%Y-%m-%d"),
                "comment": ""
            })
            future2 = future1 + timedelta(hours=random.randrange(0, 60), minutes=random.randrange(0, 60))
            if random.randrange(0, 100) < 80:
                new_struct["done"] = True
                new_struct["events"].append({
                    "type": "print_success",
                    "time": future2.strftime("%H:%M"),
                    "date": future2.strftime("%Y-%m-%d"),
                    "comment": ""
                })
            else:
                new_struct["failed"] = True
                new_struct["events"].append({
                    "type": "print_fail",
                    "time": future2.strftime("%H:%M"),
                    "date": future2.strftime("%Y-%m-%d"),
                    "comment": "Failed to print"
                })

        output.append(new_struct)

    print(json.dumps(output))


if __name__ == "__main__":
    main()
