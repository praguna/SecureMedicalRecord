import sys

def insert_record_patient(patient_name,data):
    """inserts record to the blockChain"""
    print("Record inserted .....",data)

def update_record_patient(patient_name,data):
    """updates the patient's record on the blockchain"""
    print("Record updated to ...",data)

def get_record_patient(patient_name):
    """display or return patient data"""
    print("patient data.......")

def delete_record_patient(patient_name):
    """delete record """
    print("patient record deleted ...")

def main():
    args=sys.argv
    n=len(args)
    print("hello let's begin this project..")
    if n==1: return
    elif args[1]=="add":
        if n<3:return
        insert_record_patient(args[2],args[3])
    elif args[1]=="delete":
        delete_record_patient(args[2])
    elif args[1]=="update":
        if n<3:return
        update_record_patient(args[2],args[3])
    else: print("Choose wisely")
main()    