# check_values.py
import json, glob
files = sorted(glob.glob("runs/results/*.json"))
if not files:
    print("no result files"); exit()
data = json.load(open(files[-1], "r", encoding="utf-8"))
for d in data.get("detections", []):
    print(f"[{d.get('class_name')}] length_m={d.get('length_m'):.3f}, area_m2={d.get('area_m2'):.3f}")