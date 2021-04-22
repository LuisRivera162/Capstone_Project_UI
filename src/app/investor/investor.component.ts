import { Component, OnInit } from '@angular/core';
import { ethers } from 'ethers';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

declare let require: any;
declare let window: any;

@Component({
  selector: 'app-investor',
  templateUrl: './investor.component.html',
  styleUrls: ['./investor.component.css']
})
export class InvestorComponent implements OnInit {
  private account: any;
  private signer: any;
  private provider: any;
  public logged_in = false;
  private factory: any;

  private loanAbi: any;

  public loans: any[] = [];
  public global_apy = 0.00;
  public global_insured = 0.00;

  public investing = 0.00
  public invested_in: { [key: string]: number } = {}
  public blocks = 0
  public waitingForMetamask = false;
  public showSuccessPage = false
  public showErrorPage = false
  public message = ''

  public selected_loan = {
    address: '',
    amount: 0,
    block_price: 0,
    available_blocks: 0
  };

  // public isEnabledObservable = new Subject<boolean>();

  constructor(private HttpClient: HttpClient) {
    if (window.ethereum === undefined) {
      alert('Non-Ethereum browser detected. Install MetaMask');
    } else {
      this.enableMetamaskAccount();
    }
  }

  public requestMetaMask() {
    this.enableMetamaskAccount()
  }

  private async enableMetamaskAccount() {
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });

      this.provider = new ethers.providers.Web3Provider(window.ethereum)
      this.signer = this.provider.getSigner()

      this.account = await this.signer.getAddress()
      this.logged_in = true;

      this.HttpClient.get<any>('/api/getfactory')
        .subscribe(factory => {
          this.factory = new ethers.Contract(factory.address, factory.abi, this.signer)

          this.getLoans()
        });

      // this.isEnabledObservable.next(true);
    } catch (e) {
      console.error(e.message);
    }
  }

  private async getLoans() {
    // get loans from factory contract and store in local memory
    this.HttpClient.get<any>('/api/getloan')
      .subscribe(loanInfo => {
        this.loanAbi = loanInfo.abi

        this.factory.GetLoans().then((loans: any[]) => {
          loans.forEach((loan) => {
            var dloan = new ethers.Contract(loan, loanInfo.abi, this.signer)

            // this.provider.getBalance(loan).then((res: any) => { console.log(res) })

            dloan.Info().then((res: any) => {
              dloan.GetInvestors().then((investors: any[]) => {
                var apy = this.calculateInvestorApy(
                  ethers.BigNumber.from(res[2]).toNumber(),
                  ethers.BigNumber.from(res[4]).toNumber(),
                  ethers.BigNumber.from(res[5]).toNumber()
                ) 

                investors.forEach((investor) => {
                  if (investor != '0x0000000000000000000000000000000000000000') {
                    if (investor == this.account) {
                      // found logged in wallet, save investment
                      this.investing += (ethers.BigNumber.from(res[2]).toNumber() / 10)
                    }

                    this.global_insured += ethers.BigNumber.from(res[2]).toNumber() / 10
                  }
                })

                this.global_apy += apy / (ethers.BigNumber.from(res[2]).toNumber()/10)

                this.loans.push(
                  {
                    amount: ethers.BigNumber.from(res[2]).toNumber(),
                    interest: ethers.BigNumber.from(res[4]).toNumber() / 10000,
                    state: ethers.BigNumber.from(res[7]).toNumber(),
                    investors: investors,
                    n_insured: 10 - this.calculateAvailableBlocks(investors),
                    address: loan,
                    apy: apy / (ethers.BigNumber.from(res[2]).toNumber()/10)
                  }
                )
              })
            })
          })

        }).catch((error: Error) => {
          console.log(error)
        })

      });
  }

  // public async getInsuredByInvestor() {
  //   // for loan in loans get insured by me
  //   this.loans.forEach((loan) => {
  //     loan.inversors.forEach((investor: any) => {

  //     })
  //   })
  // }

  public async buyBlock(loan_eth_address: string) {
    // send required ether amount to loan contract
  }

  public async createStubLoans() {
    this.factory.NewLoan('0x5428777E4d2aB550209DD958582Ec96EC97C2B1c', 3500, 1550, 6, 1)
    this.factory.NewLoan('0x5428777E4d2aB550209DD958582Ec96EC97C2B1c', 5000, 1050, 6, 1)
    this.factory.NewLoan('0x5428777E4d2aB550209DD958582Ec96EC97C2B1c', 2200, 2550, 3, 1)
    this.factory.NewLoan('0x5428777E4d2aB550209DD958582Ec96EC97C2B1c', 7000, 1235, 3, 1)
    this.factory.NewLoan('0x5428777E4d2aB550209DD958582Ec96EC97C2B1c', 3800, 1650, 5, 1)
    this.factory.NewLoan('0x5428777E4d2aB550209DD958582Ec96EC97C2B1c', 4500, 1030, 5, 1)
  }

  public async buy_block() {
    var dloan = new ethers.Contract(this.selected_loan.address, this.loanAbi, this.signer)

    this.waitingForMetamask = true
    this.message = 'Waiting for user signature...'

    // console.log(((this.selected_loan.block_price)*0.0005).toFixed(3))

    // console.log(ethers.utils.parseEther(((this.selected_loan.block_price)*0.0005).toFixed(3)).toNumber())

    try {
      
      var tx = await dloan.Invest({
        value: ethers.utils.parseEther(((this.selected_loan.block_price)*0.0005).toFixed(3)),
        gasLimit: 250000
      })

      this.provider.waitForTransaction(tx.hash)
        .then((res: any) => {
          // show success modal
          console.log(res)
          // this.waitingForMetamask = false
          this.showSuccessPage = true
          this.message = 'Successfully bought one (1) block.'
          // location.reload()
        }).catch((e: Error) => {
          // show error modal
          console.error(e)
          // this.waitingForMetamask = false
          this.showErrorPage = true
        })
    } catch (e) {
      console.log(e)
      this.showErrorPage = true

      if (e.code == 4001) {
        this.message = 'User denied signature. Please try again.'
      } else {
        this.message = 'Transaction Rejected'
      }

    }

    // console.log(tx)

  }

  public resetBooleans() {
    location.reload()
    // this.waitingForMetamask = false
    // this.showErrorPage = false
    // this.showSuccessPage = false
  }

  public load_loan_data(loan: any) {
    this.selected_loan.amount = loan.amount
    this.selected_loan.block_price = loan.amount / 10
    this.selected_loan.address = loan.address
    this.selected_loan.available_blocks = this.calculateAvailableBlocks(loan.investors)
  }

  ngOnInit(): void {
  }

  calculateAvailableBlocks(investors: any[]) {
    var available = 10

    investors.forEach((investor) => {
      if (investor != '0x0000000000000000000000000000000000000000') available--
    })

    return available
  }

  calculateInvestorApy(amount: number, interest: number, months: number) {
    if (interest <= 0 || months < 3) return 0

    // console.log(amount, interest, months)

    var monthly_repayment = (((interest / 10000) / 12) * amount) / (1 - (1 + ((interest / 10000) / 12)) ** (-months))

    var est_total_interest = 0

    var balance = amount

    for (var i = 1; i <= months; i++) {
      est_total_interest += ((interest / 10000) / 12) * balance
      balance -= (monthly_repayment - ((interest / 10000) / 12) * balance)
    }

    // console.log(est_total_interest * 0.30 / 10)

    return (est_total_interest * 0.30 / 10)
  }

}
