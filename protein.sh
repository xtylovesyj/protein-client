#!/bin/bash
echo "start to run code!"
PROTEIN_NAME=""
PROTEIN_ROOT_PATH=""

while getopts "P:N:" arg #选项后面的冒号表示该选项需要参数
do
        case $arg in
             P)
                PROTEIN_NAME=$OPTARG
                ;;
             N)
                PROTEIN_ROOT_PATH=$OPTARG
                ;;
             ?)  #当有不认识的选项的时候arg为?
            echo "含有未知参数"
        exit 1
        ;;
        esac
done

cd $PROTEIN_ROOT_PATH/$PROTEIN_NAME/outputFolder
#rm *
~/rosetta_bin_linux_2016.32.58837_bundle/main/source/bin/AbinitioRelax.linuxgccrelease @../inputFolder/flags >log
~/pulchra/pulchra.pl combo1.pdb
mv pul_center.pdb combo1_pul.pdb
~/pulchra/pulchra.pl combo2.pdb
mv pul_center.pdb combo2_pul.pdb
~/pulchra/pulchra.pl combo3.pdb
mv pul_center.pdb combo3_pul.pdb
~/pulchra/pulchra.pl combo4.pdb
mv pul_center.pdb combo4_pul.pdb
~/pulchra/pulchra.pl combo5.pdb
mv pul_center.pdb combo5_pul.pdb
echo "End"
